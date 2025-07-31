import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// ユーザー資格操作用のスキーマ
const userQualificationSchema = z.object({
  qualificationId: z.string().min(1),
  acquiredAt: z
    .string()
    .optional()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: 'Invalid date format',
    }),
});

const bulkUserQualificationSchema = z.object({
  qualifications: z.array(userQualificationSchema).min(1),
});

/**
 * 指定ユーザーの保有資格一覧を取得するAPI
 *
 * @description 指定されたユーザーIDに関連付けられた全ての資格情報を取得します。
 * 資格は国家資格を優先し、名前順でソートされて返却されます。
 *
 * @param {NextRequest} request - Next.jsのリクエストオブジェクト
 * @param {object} params - ルートパラメータ
 * @param {string} params.id - 取得対象のユーザーUUID
 *
 * @returns {Promise<NextResponse>} 処理結果を含むNextResponse
 * @returns {boolean} returns.success - 処理の成功可否
 * @returns {UserQualification[]} returns.data - ユーザー資格データの配列（qualification情報含む）
 * @returns {string} returns.error - エラーメッセージ（失敗時のみ）
 *
 * @throws {404} 指定されたユーザーが見つからない場合
 * @throws {500} データベースアクセスエラーやその他の内部エラーが発生した場合
 *
 * @example
 * ```
 * GET /api/users/550e8400-e29b-41d4-a716-446655440000/qualifications
 * Response: {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": "qual-123",
 *       "userId": "550e8400-e29b-41d4-a716-446655440000",
 *       "qualificationId": "cert-456",
 *       "acquiredAt": "2023-06-15T00:00:00.000Z",
 *       "qualification": {
 *         "id": "cert-456",
 *         "name": "基本情報技術者試験",
 *         "isNational": true
 *       }
 *     }
 *   ]
 * }
 * ```
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: userId } = params;

    // ユーザーの存在チェック
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    const userQualifications = await prisma.userQualification.findMany({
      where: { userId },
      include: {
        qualification: true,
      },
      orderBy: [
        { qualification: { isNational: 'desc' } },
        { qualification: { name: 'asc' } },
      ],
    });

    return NextResponse.json({
      success: true,
      data: userQualifications,
    });
  } catch (error) {
    console.error('Error fetching user qualifications:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch user qualifications',
      },
      { status: 500 }
    );
  }
}

/**
 * ユーザーに新しい資格情報を登録するAPI
 *
 * @description 指定されたユーザーに対して1つまたは複数の資格を新規登録します。
 * 既に登録済みの資格は重複制約によりスキップされます。
 *
 * @param {NextRequest} request - Next.jsのリクエストオブジェクト
 * @param {object} params - ルートパラメータ
 * @param {string} params.id - 登録対象のユーザーUUID
 * @param {object} body - リクエストボディ
 * @param {string} body.qualificationId - 登録する資格のID（単一登録時）
 * @param {string} [body.acquiredAt] - 資格取得日（ISO 8601形式、省略可能）
 * @param {object[]} [body.qualifications] - 複数登録時の資格データ配列
 * @param {string} body.qualifications[].qualificationId - 資格ID
 * @param {string} [body.qualifications[].acquiredAt] - 資格取得日
 *
 * @returns {Promise<NextResponse>} 処理結果を含むNextResponse
 * @returns {boolean} returns.success - 処理の成功可否
 * @returns {UserQualification[]} returns.data - 新規作成されたユーザー資格データの配列
 * @returns {string} returns.message - 処理結果メッセージ
 * @returns {string} returns.error - エラーメッセージ（失敗時のみ）
 * @returns {string[]} returns.notFoundQualifications - 見つからなかった資格IDの配列（該当時のみ）
 *
 * @throws {400} リクエストボディのバリデーションエラーの場合
 * @throws {404} 指定されたユーザーまたは資格が見つからない場合
 * @throws {500} データベースアクセスエラーやその他の内部エラーが発生した場合
 *
 * @example
 * ```
 * POST /api/users/550e8400-e29b-41d4-a716-446655440000/qualifications
 * Body: {
 *   "qualificationId": "cert-456",
 *   "acquiredAt": "2023-06-15"
 * }
 * Response: {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": "qual-789",
 *       "userId": "550e8400-e29b-41d4-a716-446655440000",
 *       "qualificationId": "cert-456",
 *       "acquiredAt": "2023-06-15T00:00:00.000Z",
 *       "qualification": { "name": "基本情報技術者試験" }
 *     }
 *   ],
 *   "message": "1 user qualifications created"
 * }
 * ```
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: userId } = params;
    const body = await request.json();

    let qualificationsData;
    if (Array.isArray(body.qualifications)) {
      qualificationsData =
        bulkUserQualificationSchema.parse(body).qualifications;
    } else {
      qualificationsData = [userQualificationSchema.parse(body)];
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    // 資格の存在チェック
    const qualificationIds = qualificationsData.map((q) => q.qualificationId);
    const existingQualifications = await prisma.qualification.findMany({
      where: { id: { in: qualificationIds } },
      select: { id: true },
    });

    const existingQualificationIds = existingQualifications.map((q) => q.id);
    const notFoundQualifications = qualificationIds.filter(
      (id) => !existingQualificationIds.includes(id)
    );

    if (notFoundQualifications.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Some qualifications not found',
          notFoundQualifications,
        },
        { status: 404 }
      );
    }

    // 各資格を新規登録（重複はスキップ）
    const results = [];
    for (const qualificationData of qualificationsData) {
      try {
        const result = await prisma.userQualification.create({
          data: {
            userId,
            qualificationId: qualificationData.qualificationId,
            acquiredAt: qualificationData.acquiredAt
              ? new Date(qualificationData.acquiredAt)
              : null,
          },
          include: {
            qualification: true,
          },
        });
        results.push(result);
      } catch (error: unknown) {
        // Skip duplicates (unique constraint violation)
        if (
          error &&
          typeof error === 'object' &&
          'code' in error &&
          error.code === 'P2002'
        ) {
          continue;
        }
        throw error;
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: results,
        message: `${results.length} user qualifications created`,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    console.error('Error creating user qualifications:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create user qualifications',
      },
      { status: 500 }
    );
  }
}

/**
 * ユーザーの資格情報をアップサート（作成または更新）するAPI
 *
 * @description 指定されたユーザーの資格情報を更新し、存在しない場合は新規作成します。
 * 主に資格取得日の更新に使用されます。
 *
 * @param {NextRequest} request - Next.jsのリクエストオブジェクト
 * @param {object} params - ルートパラメータ
 * @param {string} params.id - 更新対象のユーザーUUID
 * @param {object} body - リクエストボディ
 * @param {string} body.qualificationId - アップサートする資格のID（単一処理時）
 * @param {string} [body.acquiredAt] - 資格取得日（ISO 8601形式、省略可能）
 * @param {object[]} [body.qualifications] - 複数処理時の資格データ配列
 * @param {string} body.qualifications[].qualificationId - 資格ID
 * @param {string} [body.qualifications[].acquiredAt] - 資格取得日
 *
 * @returns {Promise<NextResponse>} 処理結果を含むNextResponse
 * @returns {boolean} returns.success - 処理の成功可否
 * @returns {UserQualification[]} returns.data - アップサートされたユーザー資格データの配列
 * @returns {string} returns.message - 処理結果メッセージ
 * @returns {string} returns.error - エラーメッセージ（失敗時のみ）
 *
 * @throws {400} リクエストボディのバリデーションエラーの場合
 * @throws {500} データベースアクセスエラーやその他の内部エラーが発生した場合
 *
 * @example
 * ```
 * PUT /api/users/550e8400-e29b-41d4-a716-446655440000/qualifications
 * Body: {
 *   "qualifications": [
 *     {
 *       "qualificationId": "cert-456",
 *       "acquiredAt": "2023-12-01"
 *     }
 *   ]
 * }
 * Response: {
 *   "success": true,
 *   "data": [{ ... }],
 *   "message": "1 user qualifications processed"
 * }
 * ```
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: userId } = params;
    const body = await request.json();

    let qualificationsData;
    if (Array.isArray(body.qualifications)) {
      qualificationsData =
        bulkUserQualificationSchema.parse(body).qualifications;
    } else {
      qualificationsData = [userQualificationSchema.parse(body)];
    }

    const results = [];
    for (const qualificationData of qualificationsData) {
      const result = await prisma.userQualification.upsert({
        where: {
          userId_qualificationId: {
            userId,
            qualificationId: qualificationData.qualificationId,
          },
        },
        update: {
          acquiredAt: qualificationData.acquiredAt
            ? new Date(qualificationData.acquiredAt)
            : null,
        },
        create: {
          userId,
          qualificationId: qualificationData.qualificationId,
          acquiredAt: qualificationData.acquiredAt
            ? new Date(qualificationData.acquiredAt)
            : null,
        },
        include: {
          qualification: true,
        },
      });
      results.push(result);
    }

    return NextResponse.json({
      success: true,
      data: results,
      message: `${results.length} user qualifications processed`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    console.error('Error upserting user qualifications:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to upsert user qualifications',
      },
      { status: 500 }
    );
  }
}

/**
 * ユーザーの資格情報を削除するAPI
 *
 * @description 指定されたユーザーから指定された資格情報を削除します。
 * 複数の資格を一度に削除することも可能です。
 *
 * @param {NextRequest} request - Next.jsのリクエストオブジェクト
 * @param {object} params - ルートパラメータ
 * @param {string} params.id - 削除対象のユーザーUUID
 * @param {object} body - リクエストボディ
 * @param {string[]} body.qualificationIds - 削除する資格IDの配列
 *
 * @returns {Promise<NextResponse>} 処理結果を含むNextResponse
 * @returns {boolean} returns.success - 処理の成功可否
 * @returns {string} returns.message - 処理結果メッセージ
 * @returns {number} returns.deletedCount - 削除された件数
 * @returns {string} returns.error - エラーメッセージ（失敗時のみ）
 *
 * @throws {400} リクエストボディのバリデーションエラーの場合
 * @throws {500} データベースアクセスエラーやその他の内部エラーが発生した場合
 *
 * @example
 * ```
 * DELETE /api/users/550e8400-e29b-41d4-a716-446655440000/qualifications
 * Body: {
 *   "qualificationIds": ["cert-456", "cert-789"]
 * }
 * Response: {
 *   "success": true,
 *   "message": "2 user qualifications deleted",
 *   "deletedCount": 2
 * }
 * ```
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: userId } = params;
    const body = await request.json();
    const { qualificationIds } = z
      .object({
        qualificationIds: z.array(z.string()).min(1),
      })
      .parse(body);

    const result = await prisma.userQualification.deleteMany({
      where: {
        userId,
        qualificationId: {
          in: qualificationIds,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `${result.count} user qualifications deleted`,
      deletedCount: result.count,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    console.error('Error deleting user qualifications:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete user qualifications',
      },
      { status: 500 }
    );
  }
}

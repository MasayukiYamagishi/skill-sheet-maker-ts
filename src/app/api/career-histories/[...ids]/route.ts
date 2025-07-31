import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// 経歴情報更新用のスキーマ
const updateCareerHistorySchema = z.object({
  title: z.string().min(1).optional(),
  startedAt: z
    .string()
    .optional()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: 'Invalid date format',
    }),
  endedAt: z
    .string()
    .optional()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: 'Invalid date format',
    }),
  description: z.string().optional(),
  role: z.string().optional(),
  scale: z.string().optional(),
});

/**
 * 指定された経歴ID群の経歴情報を取得するAPI
 *
 * @description 指定されたUUIDリストに対応する経歴情報を取得します。
 * 単一IDと複数ID（カンマ区切り）の両方に対応し、関連するユーザー、スキル、工程情報も含まれます。
 *
 * @param {NextRequest} request - Next.jsのリクエストオブジェクト
 * @param {object} params - ルートパラメータ
 * @param {string[]} params.ids - 取得対象の経歴UUID配列（単一またはカンマ区切り）
 *
 * @returns {Promise<NextResponse>} 処理結果を含むNextResponse
 * @returns {boolean} returns.success - 処理の成功可否
 * @returns {CareerHistory|CareerHistory[]} returns.data - 経歴データ（単一時はオブジェクト、複数時は配列）
 * @returns {string} returns.error - エラーメッセージ（失敗時のみ）
 * @returns {string[]} returns.notFoundIds - 見つからなかったIDの配列（該当時のみ）
 *
 * @throws {404} 指定された経歴IDの一部または全部が見つからない場合
 * @throws {500} データベースアクセスエラーやその他の内部エラーが発生した場合
 *
 * @example
 * ```
 * GET /api/career-histories/career-123,career-456
 * Response: {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": "career-123",
 *       "title": "ECサイト開発",
 *       "user": { "id": "user-001", "name": "田中太郎" },
 *       "careerSkills": [{ "skill": { "label": "React" } }],
 *       "careerProcesses": []
 *     }
 *   ]
 * }
 * ```
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ids: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const idsParam = resolvedParams.ids.join('/');
    const careerIds = idsParam.includes(',')
      ? idsParam.split(',').map((id) => id.trim())
      : [idsParam];

    const careerHistories = await prisma.careerHistory.findMany({
      where: {
        id: {
          in: careerIds,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        careerSkills: {
          include: {
            skill: {
              include: {
                category: true,
              },
            },
          },
        },
        careerProcesses: {
          include: {
            process: true,
          },
        },
      },
      orderBy: {
        startedAt: 'desc',
      },
    });

    const foundIds = careerHistories.map((career) => career.id);
    const notFoundIds = careerIds.filter((id) => !foundIds.includes(id));

    if (notFoundIds.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Some career histories not found',
          notFoundIds,
          data: careerHistories,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: careerIds.length === 1 ? careerHistories[0] : careerHistories,
    });
  } catch (error) {
    console.error('Error fetching career histories:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch career histories',
      },
      { status: 500 }
    );
  }
}

/**
 * 指定された経歴ID群の経歴情報を更新するAPI
 *
 * @description 指定された経歴UUIDに対してプロジェクト情報を更新します。
 * 単一更新と一括更新の両方に対応し、期間、役割、説明などを部分的に更新可能です。
 *
 * @param {NextRequest} request - Next.jsのリクエストオブジェクト
 * @param {object} params - ルートパラメータ
 * @param {string[]} params.ids - 更新対象の経歴UUID配列
 * @param {object|object[]} body - リクエストボディ
 * @param {string} [body.title] - プロジェクトタイトル
 * @param {string} [body.startedAt] - 開始日（ISO 8601形式）
 * @param {string} [body.endedAt] - 絒了日（ISO 8601形式、nullでクリア可能）
 * @param {string} [body.description] - プロジェクト説明
 * @param {string} [body.role] - 担当役割
 * @param {string} [body.scale] - プロジェクト規模
 *
 * @returns {Promise<NextResponse>} 処理結果を含むNextResponse
 * @returns {boolean} returns.success - 処理の成功可否
 * @returns {CareerHistory|CareerHistory[]} returns.data - 更新された経歴データ
 * @returns {string} returns.message - 処理結果メッセージ
 * @returns {string} returns.error - エラーメッセージ（失敗時のみ）
 *
 * @throws {400} リクエストボディのバリデーションエラーまたはID数とデータ数の不一致
 * @throws {404} 指定された経歴IDが見つからない場合
 * @throws {500} データベースアクセスエラーやその他の内部エラーが発生した場合
 *
 * @example
 * ```
 * PUT /api/career-histories/career-123
 * Body: {
 *   "title": "新しいプロジェクト名",
 *   "endedAt": "2023-12-31",
 *   "role": "リードエンジニア"
 * }
 * Response: {
 *   "success": true,
 *   "data": { "id": "career-123", "title": "新しいプロジェクト名", ... },
 *   "message": "1 career histories updated"
 * }
 * ```
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ ids: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const careerIds = resolvedParams.ids;
    const body = await request.json();

    // Handle both single and bulk updates
    let updatesData;
    if (Array.isArray(body)) {
      if (body.length !== careerIds.length) {
        return NextResponse.json(
          {
            success: false,
            error: 'Number of IDs and update data must match',
          },
          { status: 400 }
        );
      }
      updatesData = body.map((update) =>
        updateCareerHistorySchema.parse(update)
      );
    } else {
      if (careerIds.length !== 1) {
        return NextResponse.json(
          {
            success: false,
            error: 'Single update data provided for multiple IDs',
          },
          { status: 400 }
        );
      }
      updatesData = [updateCareerHistorySchema.parse(body)];
    }

    const results = [];
    for (let i = 0; i < careerIds.length; i++) {
      const careerId = careerIds[i];
      const updateData = updatesData[i];

      const existingCareer = await prisma.careerHistory.findUnique({
        where: { id: careerId },
      });

      if (!existingCareer) {
        return NextResponse.json(
          {
            success: false,
            error: `Career history not found: ${careerId}`,
          },
          { status: 404 }
        );
      }

      const result = await prisma.careerHistory.update({
        where: { id: careerId },
        data: {
          ...updateData,
          startedAt: updateData.startedAt
            ? new Date(updateData.startedAt)
            : undefined,
          endedAt: updateData.endedAt
            ? new Date(updateData.endedAt)
            : updateData.endedAt === null
              ? null
              : undefined,
        },
        include: {
          careerSkills: {
            include: {
              skill: true,
            },
          },
          careerProcesses: {
            include: {
              process: true,
            },
          },
        },
      });
      results.push(result);
    }

    return NextResponse.json({
      success: true,
      data: results.length === 1 ? results[0] : results,
      message: `${results.length} career histories updated`,
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

    console.error('Error updating career histories:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update career histories',
      },
      { status: 500 }
    );
  }
}

/**
 * 指定された経歴ID群の経歴情報を削除するAPI
 *
 * @description 指定された経歴UUIDに対応する経歴情報をデータベースから完全に削除します。
 * 関連するスキル情報や工程情報も同時に削除されます。単一および複数削除に対応しています。
 *
 * @param {NextRequest} request - Next.jsのリクエストオブジェクト
 * @param {object} params - ルートパラメータ
 * @param {string[]} params.ids - 削除対象の経歴UUID配列
 *
 * @returns {Promise<NextResponse>} 処理結果を含むNextResponse
 * @returns {boolean} returns.success - 処理の成功可否
 * @returns {string} returns.message - 処理結果メッセージ
 * @returns {number} returns.deletedCount - 実際に削除された件数
 * @returns {string} returns.error - エラーメッセージ（失敗時のみ）
 * @returns {string[]} returns.notFoundIds - 見つからなかったIDの配列（該当時のみ）
 *
 * @throws {404} 指定された経歴IDの一部または全部が見つからない場合
 * @throws {500} データベースアクセスエラーやその他の内部エラーが発生した場合
 *
 * @example
 * ```
 * DELETE /api/career-histories/career-123,career-456
 * Response: {
 *   "success": true,
 *   "message": "2 career histories deleted",
 *   "deletedCount": 2
 * }
 * ```
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ ids: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const careerIds = resolvedParams.ids;

    // Check if all career histories exist
    const existingCareers = await prisma.careerHistory.findMany({
      where: { id: { in: careerIds } },
      select: { id: true },
    });

    const foundIds = existingCareers.map((career) => career.id);
    const notFoundIds = careerIds.filter((id) => !foundIds.includes(id));

    if (notFoundIds.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Some career histories not found',
          notFoundIds,
        },
        { status: 404 }
      );
    }

    const result = await prisma.careerHistory.deleteMany({
      where: {
        id: {
          in: careerIds,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `${result.count} career histories deleted`,
      deletedCount: result.count,
    });
  } catch (error) {
    console.error('Error deleting career histories:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete career histories',
      },
      { status: 500 }
    );
  }
}

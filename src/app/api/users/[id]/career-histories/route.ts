import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// 経歴情報操作用のスキーマ
const careerHistorySchema = z.object({
  title: z.string().min(1),
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

const bulkCareerHistorySchema = z.object({
  careerHistories: z.array(careerHistorySchema).min(1),
});

/**
 * 指定ユーザーの経歴情報一覧を取得するAPI
 *
 * @description 指定されたユーザーIDに関連付けられた全ての経歴情報を取得します。
 * 経歴情報には関連するスキル情報と担当工程情報も含まれ、開始日の降順でソートされて返却されます。
 *
 * @param {NextRequest} request - Next.jsのリクエストオブジェクト
 * @param {object} params - ルートパラメータ
 * @param {string} params.id - 取得対象のユーザーUUID
 *
 * @returns {Promise<NextResponse>} 処理結果を含むNextResponse
 * @returns {boolean} returns.success - 処理の成功可否
 * @returns {CareerHistory[]} returns.data - ユーザー経歴データの配列（スキル、工程情報含む）
 * @returns {string} returns.error - エラーメッセージ（失敗時のみ）
 *
 * @throws {404} 指定されたユーザーが見つからない場合
 * @throws {500} データベースアクセスエラーやその他の内部エラーが発生した場合
 *
 * @example
 * ```
 * GET /api/users/550e8400-e29b-41d4-a716-446655440000/career-histories
 * Response: {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": "career-123",
 *       "userId": "550e8400-e29b-41d4-a716-446655440000",
 *       "title": "ECサイト開発プロジェクト",
 *       "startedAt": "2023-01-01T00:00:00.000Z",
 *       "endedAt": "2023-06-30T00:00:00.000Z",
 *       "description": "React/Node.jsによるECサイト構築",
 *       "role": "フロントエンドエンジニア",
 *       "scale": "10名",
 *       "careerSkills": [{ "skill": { "label": "React" } }],
 *       "careerProcesses": [{ "process": { "name": "プログラミング" } }]
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

    const careerHistories = await prisma.careerHistory.findMany({
      where: { userId },
      include: {
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

    return NextResponse.json({
      success: true,
      data: careerHistories,
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
 * ユーザーに新しい経歴情報を登録するAPI
 *
 * @description 指定されたユーザーに対して1つまたは複数の経歴情報を新規登録します。
 * プロジェクト名、期間、役割、規模などの詳細情報を含む完全な経歴レコードを作成します。
 *
 * @param {NextRequest} request - Next.jsのリクエストオブジェクト
 * @param {object} params - ルートパラメータ
 * @param {string} params.id - 登録対象のユーザーUUID
 * @param {object} body - リクエストボディ
 * @param {string} body.title - プロジェクト・業務タイトル（必須）
 * @param {string} [body.startedAt] - 開始日（ISO 8601形式、省略可能）
 * @param {string} [body.endedAt] - 終了日（ISO 8601形式、省略可能）
 * @param {string} [body.description] - プロジェクトの詳細説明
 * @param {string} [body.role] - 担当役割（例：フロントエンドエンジニア）
 * @param {string} [body.scale] - プロジェクト規模（例：10名）
 * @param {object[]} [body.careerHistories] - 複数登録時の経歴データ配列
 *
 * @returns {Promise<NextResponse>} 処理結果を含むNextResponse
 * @returns {boolean} returns.success - 処理の成功可否
 * @returns {CareerHistory[]} returns.data - 新規作成された経歴データの配列
 * @returns {string} returns.message - 処理結果メッセージ
 * @returns {string} returns.error - エラーメッセージ（失敗時のみ）
 *
 * @throws {400} リクエストボディのバリデーションエラーの場合
 * @throws {404} 指定されたユーザーが見つからない場合
 * @throws {500} データベースアクセスエラーやその他の内部エラーが発生した場合
 *
 * @example
 * ```
 * POST /api/users/550e8400-e29b-41d4-a716-446655440000/career-histories
 * Body: {
 *   "title": "ECサイト開発プロジェクト",
 *   "startedAt": "2023-01-01",
 *   "endedAt": "2023-06-30",
 *   "description": "React/Node.jsによるECサイト構築",
 *   "role": "フロントエンドエンジニア",
 *   "scale": "10名"
 * }
 * Response: {
 *   "success": true,
 *   "data": [{ "id": "career-456", "title": "ECサイト開発プロジェクト", ... }],
 *   "message": "1 career histories created"
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

    let careerHistoriesData;
    if (Array.isArray(body.careerHistories)) {
      careerHistoriesData = bulkCareerHistorySchema.parse(body).careerHistories;
    } else {
      careerHistoriesData = [careerHistorySchema.parse(body)];
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

    const results = [];
    for (const careerData of careerHistoriesData) {
      const result = await prisma.careerHistory.create({
        data: {
          userId,
          title: careerData.title,
          startedAt: careerData.startedAt
            ? new Date(careerData.startedAt)
            : null,
          endedAt: careerData.endedAt ? new Date(careerData.endedAt) : null,
          description: careerData.description,
          role: careerData.role,
          scale: careerData.scale,
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

    return NextResponse.json(
      {
        success: true,
        data: results,
        message: `${results.length} career histories created`,
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

    console.error('Error creating career histories:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create career histories',
      },
      { status: 500 }
    );
  }
}

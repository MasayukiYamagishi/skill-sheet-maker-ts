import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// 経歴担当工程操作用のスキーマ
const careerProcessSchema = z.object({
  processIds: z.array(z.number().int().positive()).min(1),
});

/**
 * 指定経歴の担当工程一覧を取得するAPI
 *
 * @description 指定された経歴UUIDに関連付けられた全ての担当工程情報を取得します。
 * 工程は工程IDの昇順でソートされ、関連するマスター工程情報と経歴情報も含まれます。
 *
 * @param {NextRequest} request - Next.jsのリクエストオブジェクト
 * @param {object} params - ルートパラメータ
 * @param {string} params.careerId - 取得対象の経歴UUID
 *
 * @returns {Promise<NextResponse>} 処理結果を含むNextResponse
 * @returns {boolean} returns.success - 処理の成功可否
 * @returns {CareerProcess[]} returns.data - 経歴担当工程データの配列（工程、経歴情報含む）
 * @returns {string} returns.error - エラーメッセージ（失敗時のみ）
 *
 * @throws {500} データベースアクセスエラーやその他の内部エラーが発生した場合
 *
 * @example
 * ```
 * GET /api/career-histories/career-123/processes
 * Response: {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": "cp-001",
 *       "careerId": "career-123",
 *       "processId": 1,
 *       "process": {
 *         "id": 1,
 *         "name": "要件定義",
 *         "description": "システムの要件を定義する工程"
 *       },
 *       "career": { "id": "career-123", "title": "ECサイト開発" }
 *     }
 *   ]
 * }
 * ```
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { careerId: string } }
) {
  try {
    const { careerId } = params;

    const careerProcesses = await prisma.careerProcess.findMany({
      where: { careerId },
      include: {
        process: true,
        career: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        processId: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      data: careerProcesses,
    });
  } catch (error) {
    console.error('Error fetching career processes:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch career processes',
      },
      { status: 500 }
    );
  }
}

/**
 * 経歴の担当工程情報を設定するAPI
 *
 * @description 指定された経歴の担当工程を完全に置き換えます。
 * 既存の全ての担当工程を削除し、新しい工程リストで置き換えることで、マルチセレクトフォームの更新に対応します。
 *
 * @param {NextRequest} request - Next.jsのリクエストオブジェクト
 * @param {object} params - ルートパラメータ
 * @param {string} params.careerId - 設定対象の経歴UUID
 * @param {object} body - リクエストボディ
 * @param {number[]} body.processIds - 設定する担当工程IDの配列（正の整数）
 *
 * @returns {Promise<NextResponse>} 処理結果を含むNextResponse
 * @returns {boolean} returns.success - 処理の成功可否
 * @returns {CareerProcess[]} returns.data - 設定された経歴担当工程データの配列
 * @returns {string} returns.message - 処理結果メッセージ
 * @returns {string} returns.error - エラーメッセージ（失敗時のみ）
 * @returns {number[]} returns.notFoundProcesses - 見つからなかった工程IDの配列（該当時のみ）
 *
 * @throws {400} リクエストボディのバリデーションエラーの場合
 * @throws {404} 指定された経歴または工程が見つからない場合
 * @throws {500} データベースアクセスエラーやその他の内部エラーが発生した場合
 *
 * @example
 * ```
 * POST /api/career-histories/career-123/processes
 * Body: {
 *   "processIds": [1, 2, 4]
 * }
 * Response: {
 *   "success": true,
 *   "data": [
 *     { "id": "cp-001", "processId": 1, "process": { "name": "要件定義" } },
 *     { "id": "cp-002", "processId": 2, "process": { "name": "基本設計" } },
 *     { "id": "cp-003", "processId": 4, "process": { "name": "プログラミング" } }
 *   ],
 *   "message": "3 career processes set"
 * }
 * ```
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { careerId: string } }
) {
  try {
    const { careerId } = params;
    const body = await request.json();
    const { processIds } = careerProcessSchema.parse(body);

    // Check if career exists
    const career = await prisma.careerHistory.findUnique({
      where: { id: careerId },
      select: { id: true },
    });

    if (!career) {
      return NextResponse.json(
        {
          success: false,
          error: 'Career history not found',
        },
        { status: 404 }
      );
    }

    // Check if processes exist
    const existingProcesses = await prisma.masterProcess.findMany({
      where: { id: { in: processIds } },
      select: { id: true },
    });

    const existingProcessIds = existingProcesses.map((p) => p.id);
    const notFoundProcesses = processIds.filter(
      (id) => !existingProcessIds.includes(id)
    );

    if (notFoundProcesses.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Some processes not found',
          notFoundProcesses,
        },
        { status: 404 }
      );
    }

    // First, remove all existing processes for this career
    await prisma.careerProcess.deleteMany({
      where: { careerId },
    });

    // Then add the new processes
    const results = [];
    for (const processId of processIds) {
      const result = await prisma.careerProcess.create({
        data: {
          careerId,
          processId,
        },
        include: {
          process: true,
        },
      });
      results.push(result);
    }

    return NextResponse.json(
      {
        success: true,
        data: results,
        message: `${results.length} career processes set`,
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

    console.error('Error upserting career processes:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to upsert career processes',
      },
      { status: 500 }
    );
  }
}

/**
 * 経歴から担当工程情報を削除するAPI
 *
 * @description 指定された経歴から指定された工程ID群に対応する担当工程情報を削除します。
 * 複数の担当工程を一度に削除することも可能です。
 *
 * @param {NextRequest} request - Next.jsのリクエストオブジェクト
 * @param {object} params - ルートパラメータ
 * @param {string} params.careerId - 削除対象の経歴UUID
 * @param {object} body - リクエストボディ
 * @param {number[]} body.processIds - 削除する担当工程IDの配列（正の整数）
 *
 * @returns {Promise<NextResponse>} 処理結果を含むNextResponse
 * @returns {boolean} returns.success - 処理の成功可否
 * @returns {string} returns.message - 処理結果メッセージ
 * @returns {number} returns.deletedCount - 実際に削除された件数
 * @returns {string} returns.error - エラーメッセージ（失敗時のみ）
 *
 * @throws {400} リクエストボディのバリデーションエラーの場合
 * @throws {500} データベースアクセスエラーやその他の内部エラーが発生した場合
 *
 * @example
 * ```
 * DELETE /api/career-histories/career-123/processes
 * Body: {
 *   "processIds": [1, 3]
 * }
 * Response: {
 *   "success": true,
 *   "message": "2 career processes deleted",
 *   "deletedCount": 2
 * }
 * ```
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { careerId: string } }
) {
  try {
    const { careerId } = params;
    const body = await request.json();
    const { processIds } = z
      .object({
        processIds: z.array(z.number().int().positive()).min(1),
      })
      .parse(body);

    const result = await prisma.careerProcess.deleteMany({
      where: {
        careerId,
        processId: {
          in: processIds,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `${result.count} career processes deleted`,
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

    console.error('Error deleting career processes:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete career processes',
      },
      { status: 500 }
    );
  }
}

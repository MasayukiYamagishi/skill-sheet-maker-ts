import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// 一括削除用のスキーマ
const bulkDeleteSchema = z.object({
  ids: z.array(z.string().uuid()).min(1),
});

/**
 * 複数ユーザーの一括削除API
 *
 * @description 指定された複数のユーザーIDを一括で削除します。
 * 全てのユーザーが存在することを事前に確認し、存在しないユーザーがある場合はエラーを返します。
 *
 * @param {NextRequest} request - Next.jsのリクエストオブジェクト
 * @param {object} request.body - リクエストボディ
 * @param {string[]} request.body.ids - 削除したいユーザーUUIDの配列
 *
 * @returns {Promise<NextResponse>} 削除結果を含むJSON レスポンス
 * @returns {boolean} returns.success - 処理の成功可否
 * @returns {string} returns.message - 削除完了メッセージ
 * @returns {number} returns.deletedCount - 削除されたユーザー数
 *
 * @throws {400} バリデーションエラーの場合
 * @throws {404} 指定されたIDの一部または全部のユーザーが存在しない場合
 * @throws {500} サーバー内部エラーの場合
 *
 * @example
 * ```
 * DELETE /api/users/bulk
 * Content-Type: application/json
 *
 * {
 *   "ids": ["123e4567-e89b-12d3-a456-426614174000", "987fcdeb-51a2-43d1-9f12-123456789abc"]
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "message": "2 users deleted successfully",
 *   "deletedCount": 2
 * }
 * ```
 */
export async function DELETE(request: NextRequest) {
  try {
    // リクエストボディの取得とバリデーション
    const body = await request.json();
    const { ids } = bulkDeleteSchema.parse(body);

    // 削除対象のユーザーが全て存在するかチェック
    const existingUsers = await prisma.user.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: { id: true },
    });

    const existingIds = existingUsers.map((user) => user.id);
    const notFoundIds = ids.filter((id) => !existingIds.includes(id));

    if (notFoundIds.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Some users not found',
          notFoundIds,
        },
        { status: 404 }
      );
    }

    const result = await prisma.user.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `${result.count} users deleted successfully`,
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

    console.error('Error bulk deleting users:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete users',
      },
      { status: 500 }
    );
  }
}

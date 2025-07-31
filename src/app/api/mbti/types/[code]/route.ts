import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 指定MBTIタイプコードの詳細情報を取得するAPI
 *
 * @description 指定されたMBTIタイプコード（例：INTJ、ENFP）の詳細情報を取得します。
 * グループ情報、名称、説明、その他の詳細データと、このタイプを持つユーザー一覧も含まれます。
 *
 * @param {NextRequest} request - Next.jsのリクエストオブジェクト
 * @param {object} params - ルートパラメータ
 * @param {string} params.code - MBTIタイプコード（4文字、例：INTJ、ENFP）
 *
 * @returns {Promise<NextResponse>} 処理結果を含むNextResponse
 * @returns {boolean} returns.success - 処理の成功可否
 * @returns {MBTIType} returns.data - MBTIタイプの詳細情報
 * @returns {string} returns.data.code - MBTIタイプコード
 * @returns {string} returns.data.name - タイプ名（日本語）
 * @returns {string} returns.data.nameEn - タイプ名（英語）
 * @returns {string} returns.data.description - タイプの説明
 * @returns {MBTIGroup} returns.data.group - 所属するグループ情報
 * @returns {User[]} returns.data.users - このタイプを持つユーザー一覧
 * @returns {string} returns.error - エラーメッセージ（失敗時のみ）
 *
 * @throws {404} 指定されたMBTIタイプコードが見つからない場合
 * @throws {500} データベースアクセスエラーやその他の内部エラーが発生した場合
 *
 * @example
 * ```
 * GET /api/mbti/types/INTJ
 * Response: {
 *   "success": true,
 *   "data": {
 *     "code": "INTJ",
 *     "name": "建築家",
 *     "nameEn": "Architect",
 *     "description": "想像力が豊かで戦略的な思考の持ち主...",
 *     "group": { "id": "nt", "name": "分析家" },
 *     "users": [
 *       {
 *         "id": "user-001",
 *         "name": "田中太郎",
 *         "mbtiIdentity": "A",
 *         "mbtiIdentityRef": { "label": "神経質", "description": "..." }
 *       }
 *     ]
 *   }
 * }
 * ```
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params;

    const mbtiType = await prisma.mbtiType.findUnique({
      where: { code: code.toUpperCase() },
      include: {
        group: true,
        users: {
          select: {
            id: true,
            name: true,
            mbtiIdentity: true,
            mbtiIdentityRef: {
              select: {
                label: true,
                description: true,
              },
            },
          },
        },
      },
    });

    if (!mbtiType) {
      return NextResponse.json(
        {
          success: false,
          error: 'MBTI type not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: mbtiType,
    });
  } catch (error) {
    console.error('Error fetching MBTI type:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch MBTI type',
      },
      { status: 500 }
    );
  }
}

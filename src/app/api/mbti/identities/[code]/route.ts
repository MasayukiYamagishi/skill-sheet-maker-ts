import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 指定MBTIアイデンティティコードの詳細情報を取得するAPI
 *
 * @description 指定されたMBTIアイデンティティコード（AまたはT）の詳細情報を取得します。
 * A型（神経質型）とT型（乱気型）の特徴や説明、そしてこのアイデンティティを持つユーザー一覧も含まれます。
 *
 * @param {NextRequest} request - Next.jsのリクエストオブジェクト
 * @param {object} params - ルートパラメータ
 * @param {string} params.code - MBTIアイデンティティコード（AまたはTのみ有効）
 *
 * @returns {Promise<NextResponse>} 処理結果を含むNextResponse
 * @returns {boolean} returns.success - 処理の成功可否
 * @returns {MBTIIdentity} returns.data - MBTIアイデンティティの詳細情報
 * @returns {string} returns.data.code - アイデンティティコード（AまたはT）
 * @returns {string} returns.data.label - アイデンティティラベル（例：神経質、乱気）
 * @returns {string} returns.data.description - アイデンティティの詳細説明
 * @returns {User[]} returns.data.users - このアイデンティティを持つユーザー一覧
 * @returns {string} returns.error - エラーメッセージ（失敗時のみ）
 *
 * @throws {400} 無効なMBTIアイデンティティコードが指定された場合（AまたはT以外）
 * @throws {404} 指定されたアイデンティティコードが見つからない場合
 * @throws {500} データベースアクセスエラーやその他の内部エラーが発生した場合
 *
 * @example
 * ```
 * GET /api/mbti/identities/A
 * Response: {
 *   "success": true,
 *   "data": {
 *     "code": "A",
 *     "label": "神経質",
 *     "description": "自分に自信があり、リラックスしているタイプ",
 *     "users": [
 *       {
 *         "id": "user-001",
 *         "name": "田中太郎",
 *         "mbtiType": "INTJ",
 *         "mbtiTypeRef": {
 *           "name": "建築家",
 *           "description": "想像力が豊かで..."
 *         }
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

    if (!['A', 'T'].includes(code.toUpperCase())) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid MBTI identity code. Must be A or T',
        },
        { status: 400 }
      );
    }

    const mbtiIdentity = await prisma.mbtiIdentity.findUnique({
      where: { code: code.toUpperCase() },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            mbtiType: true,
            mbtiTypeRef: {
              select: {
                name: true,
                description: true,
              },
            },
          },
        },
      },
    });

    if (!mbtiIdentity) {
      return NextResponse.json(
        {
          success: false,
          error: 'MBTI identity not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: mbtiIdentity,
    });
  } catch (error) {
    console.error('Error fetching MBTI identity:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch MBTI identity',
      },
      { status: 500 }
    );
  }
}

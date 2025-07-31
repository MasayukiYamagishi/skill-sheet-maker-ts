import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 指定MBTIグループIDの詳細情報を取得するAPI
 *
 * @description 指定されたMBTIグループID（例：nt、nf、st、sf）の詳細情報を取得します。
 * グループに属する全てのMBTIタイプ（4種類）の情報も含まれます。
 *
 * @param {NextRequest} request - Next.jsのリクエストオブジェクト
 * @param {object} params - ルートパラメータ
 * @param {string} params.id - MBTIグループID（例：nt、nf、st、sf）
 *
 * @returns {Promise<NextResponse>} 処理結果を含むNextResponse
 * @returns {boolean} returns.success - 処理の成功可否
 * @returns {MBTIGroup} returns.data - MBTIグループの詳細情報
 * @returns {string} returns.data.id - グループID
 * @returns {string} returns.data.name - グループ名（日本語）
 * @returns {string} returns.data.nameEn - グループ名（英語）
 * @returns {string} returns.data.description - グループの説明
 * @returns {MBTIType[]} returns.data.mbtiTypes - グループに属するMBTIタイプ一覧
 * @returns {string} returns.error - エラーメッセージ（失敗時のみ）
 *
 * @throws {404} 指定されたMBTIグループIDが見つからない場合
 * @throws {500} データベースアクセスエラーやその他の内部エラーが発生した場合
 *
 * @example
 * ```
 * GET /api/mbti/groups/nt
 * Response: {
 *   "success": true,
 *   "data": {
 *     "id": "nt",
 *     "name": "分析家",
 *     "nameEn": "Analysts",
 *     "description": "理性と好奇心を武器にしているタイプ",
 *     "mbtiTypes": [
 *       { "code": "INTJ", "name": "建築家", "nameEn": "Architect" },
 *       { "code": "INTP", "name": "論理学者", "nameEn": "Thinker" },
 *       { "code": "ENTJ", "name": "指揮官", "nameEn": "Commander" },
 *       { "code": "ENTP", "name": "討論者", "nameEn": "Debater" }
 *     ]
 *   }
 * }
 * ```
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const mbtiGroup = await prisma.mbtiGroup.findUnique({
      where: { id },
      include: {
        mbtiTypes: {
          select: {
            code: true,
            name: true,
            nameEn: true,
            description: true,
          },
        },
      },
    });

    if (!mbtiGroup) {
      return NextResponse.json(
        {
          success: false,
          error: 'MBTI group not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: mbtiGroup,
    });
  } catch (error) {
    console.error('Error fetching MBTI group:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch MBTI group',
      },
      { status: 500 }
    );
  }
}

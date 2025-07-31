import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 指定されたスキルカテゴリーID群の詳細情報を取得するAPI
 *
 * @description 指定されたカテゴリーIDリストに対応するカテゴリ情報を取得します。
 * 単一IDと複数ID（カンマ区切り）の両方に対応し、各カテゴリに属するスキルの詳細情報も含まれます。
 *
 * @param {NextRequest} request - Next.jsのリクエストオブジェクト
 * @param {object} params - ルートパラメータ
 * @param {string[]} params.ids - 取得対象のカテゴリーID配列（単一またはカンマ区切り）
 *
 * @returns {Promise<NextResponse>} 処理結果を含むNextResponse
 * @returns {boolean} returns.success - 処理の成功可否
 * @returns {SkillCategory|SkillCategory[]} returns.data - カテゴリデータ（単一時はオブジェクト、複数時は配列）
 * @returns {string} returns.data.id - カテゴリーID
 * @returns {string} returns.data.name - カテゴリ名
 * @returns {string} returns.data.description - カテゴリ説明
 * @returns {Skill[]} returns.data.skills - カテゴリに属するスキル一覧
 * @returns {string} returns.error - エラーメッセージ（失敗時のみ）
 * @returns {string[]} returns.notFoundIds - 見つからなかったIDの配列（該当時のみ）
 *
 * @throws {404} 指定されたカテゴリーIDの一部または全部が見つからない場合
 * @throws {500} データベースアクセスエラーやその他の内部エラーが発生した場合
 *
 * @example
 * ```
 * GET /api/skills/categories/frontend,backend
 * Response: {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": "frontend",
 *       "name": "フロントエンド",
 *       "description": "UI/UX関連技術",
 *       "skills": [
 *         {
 *           "id": "react",
 *           "label": "React",
 *           "description": "JavaScriptライブラリ",
 *           "deviconId": "react"
 *         }
 *       ]
 *     }
 *   ]
 * }
 * ```
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { ids: string[] } }
) {
  try {
    const idsParam = params.ids.join('/');
    const categoryIds = idsParam.includes(',')
      ? idsParam.split(',').map((id) => id.trim())
      : [idsParam];

    const categories = await prisma.skillCategory.findMany({
      where: {
        id: {
          in: categoryIds,
        },
      },
      include: {
        skills: {
          select: {
            id: true,
            label: true,
            description: true,
            deviconId: true,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });

    const foundIds = categories.map((category) => category.id);
    const notFoundIds = categoryIds.filter((id) => !foundIds.includes(id));

    if (notFoundIds.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Some categories not found',
          notFoundIds,
          data: categories,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: categoryIds.length === 1 ? categories[0] : categories,
    });
  } catch (error) {
    console.error('Error fetching skill categories:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch skill categories',
      },
      { status: 500 }
    );
  }
}

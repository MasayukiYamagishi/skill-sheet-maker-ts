import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 指定されたスキルID群の詳細情報を取得するAPI
 *
 * @description 指定されたスキルIDリストに対応するスキル情報を取得します。
 * 単一IDと複数ID（カンマ区切り）の両方に対応し、カテゴリ情報、タグ情報も含まれます。
 * スキルはカテゴリーID、ラベル名の順でソートされて返却されます。
 *
 * @param {NextRequest} request - Next.jsのリクエストオブジェクト
 * @param {object} params - ルートパラメータ
 * @param {string[]} params.ids - 取得対象のスキルID配列（単一またはカンマ区切り）
 *
 * @returns {Promise<NextResponse>} 処理結果を含むNextResponse
 * @returns {boolean} returns.success - 処理の成功可否
 * @returns {Skill|Skill[]} returns.data - スキルデータ（単一時はオブジェクト、複数時は配列）
 * @returns {string} returns.data.id - スキルID
 * @returns {string} returns.data.label - スキル名
 * @returns {string} returns.data.description - スキル説明
 * @returns {SkillCategory} returns.data.category - スキルカテゴリ情報
 * @returns {SkillTag[]} returns.data.tags - 関連タグ一覧
 * @returns {string} returns.error - エラーメッセージ（失敗時のみ）
 * @returns {string[]} returns.notFoundIds - 見つからなかったIDの配列（該当時のみ）
 *
 * @throws {404} 指定されたスキルIDの一部または全部が見つからない場合
 * @throws {500} データベースアクセスエラーやその他の内部エラーが発生した場合
 *
 * @example
 * ```
 * GET /api/skills/react,vue,angular
 * Response: {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": "react",
 *       "label": "React",
 *       "description": "JavaScriptライブラリ",
 *       "category": { "id": "frontend", "name": "フロントエンド" },
 *       "tags": [{ "id": "ui", "label": "UIライブラリ" }]
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
    // Handle both single ID and comma-separated IDs
    const idsParam = params.ids.join('/');
    const skillIds = idsParam.includes(',')
      ? idsParam.split(',').map((id) => id.trim())
      : [idsParam];

    const skills = await prisma.skill.findMany({
      where: {
        id: {
          in: skillIds,
        },
      },
      include: {
        category: true,
        skillTagMaps: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: [{ categoryId: 'asc' }, { label: 'asc' }],
    });

    // Transform the data to include tags directly
    const skillsWithTags = skills.map((skill) => ({
      ...skill,
      tags: skill.skillTagMaps.map((tagMap) => tagMap.tag),
      skillTagMaps: undefined,
    }));

    // Check if all requested skills were found
    const foundIds = skills.map((skill) => skill.id);
    const notFoundIds = skillIds.filter((id) => !foundIds.includes(id));

    if (notFoundIds.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Some skills not found',
          notFoundIds,
          data: skillsWithTags,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: skillIds.length === 1 ? skillsWithTags[0] : skillsWithTags,
    });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch skills',
      },
      { status: 500 }
    );
  }
}

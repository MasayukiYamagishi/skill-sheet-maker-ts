import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

/**
 * 全スキル情報を取得するAPI
 *
 * @description 登録されている全スキルの情報をカテゴリ、タグ情報と共に取得します。
 * スキルはカテゴリ順、ラベル順でソートされて返却されます。
 *
 * @returns {Promise<NextResponse>} スキル一覧を含むJSON レスポンス
 * @returns {boolean} returns.success - 処理の成功可否
 * @returns {Skill[]} returns.data - スキル情報の配列（カテゴリ、タグ情報含む）
 *
 * @throws {500} サーバー内部エラーの場合
 *
 * @example
 * ```
 * GET /api/skills
 *
 * Response:
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": "skill_javascript",
 *       "label": "JavaScript",
 *       "description": "ウェブ開発で主流のスクリプト言語。",
 *       "category": { "id": "language", "label": "プログラミング言語" },
 *       "tags": [{ "id": "web", "label": "ウェブ" }]
 *     }
 *   ]
 * }
 * ```
 */
export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
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
      skillTagMaps: undefined, // Remove the nested structure
    }));

    return NextResponse.json({
      success: true,
      data: skillsWithTags,
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

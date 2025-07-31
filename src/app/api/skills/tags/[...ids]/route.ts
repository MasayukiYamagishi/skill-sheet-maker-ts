import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 指定されたスキルタグID群の詳細情報を取得するAPI
 *
 * @description 指定されたタグIDリストに対応するタグ情報を取得します。
 * 単一IDと複数ID（カンマ区切り）の両方に対応し、各タグに関連付けられたスキルの詳細情報も含まれます。
 *
 * @param {NextRequest} request - Next.jsのリクエストオブジェクト
 * @param {object} params - ルートパラメータ
 * @param {string[]} params.ids - 取得対象のタグID配列（単一またはカンマ区切り）
 *
 * @returns {Promise<NextResponse>} 処理結果を含むNextResponse
 * @returns {boolean} returns.success - 処理の成功可否
 * @returns {SkillTag|SkillTag[]} returns.data - タグデータ（単一時はオブジェクト、複数時は配列）
 * @returns {string} returns.data.id - タグID
 * @returns {string} returns.data.label - タグ名
 * @returns {string} returns.data.description - タグ説明
 * @returns {Skill[]} returns.data.skills - タグに関連付けられたスキル一覧
 * @returns {string} returns.error - エラーメッセージ（失敗時のみ）
 * @returns {string[]} returns.notFoundIds - 見つからなかったIDの配列（該当時のみ）
 *
 * @throws {404} 指定されたタグIDの一部または全部が見つからない場合
 * @throws {500} データベースアクセスエラーやその他の内部エラーが発生した場合
 *
 * @example
 * ```
 * GET /api/skills/tags/ui-library,state-management
 * Response: {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": "ui-library",
 *       "label": "UIライブラリ",
 *       "description": "ユーザーインターフェース構築ライブラリ",
 *       "skills": [
 *         {
 *           "id": "react",
 *           "label": "React",
 *           "description": "JavaScriptライブラリ",
 *           "deviconId": "react",
 *           "categoryId": "frontend"
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
    const tagIds = idsParam.includes(',')
      ? idsParam.split(',').map((id) => id.trim())
      : [idsParam];

    const tags = await prisma.skillTag.findMany({
      where: {
        id: {
          in: tagIds,
        },
      },
      include: {
        skillTagMaps: {
          include: {
            skill: {
              select: {
                id: true,
                label: true,
                description: true,
                deviconId: true,
                categoryId: true,
              },
            },
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });

    // Transform to include skills directly
    const tagsWithSkills = tags.map((tag) => ({
      ...tag,
      skills: tag.skillTagMaps.map((tagMap) => tagMap.skill),
      skillTagMaps: undefined,
    }));

    const foundIds = tags.map((tag) => tag.id);
    const notFoundIds = tagIds.filter((id) => !foundIds.includes(id));

    if (notFoundIds.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Some tags not found',
          notFoundIds,
          data: tagsWithSkills,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: tagIds.length === 1 ? tagsWithSkills[0] : tagsWithSkills,
    });
  } catch (error) {
    console.error('Error fetching skill tags:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch skill tags',
      },
      { status: 500 }
    );
  }
}

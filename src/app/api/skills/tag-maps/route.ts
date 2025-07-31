import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

/**
 * スキルタグマップ一覧を取得するAPI
 *
 * @description スキルとタグの対応関係情報を取得します。
 * クエリパラメータでskillIdまたはtagIdを指定することで、特定のスキルに関連付けられたタグ、または特定のタグに関連付けられたスキルを絞り込むことができます。
 *
 * @param {NextRequest} request - Next.jsのリクエストオブジェクト
 * @param {string} [request.searchParams.skillId] - 特定スキルIDでフィルタリングするためのクエリパラメータ
 * @param {string} [request.searchParams.tagId] - 特定タグIDでフィルタリングするためのクエリパラメータ
 *
 * @returns {Promise<NextResponse>} 処理結果を含むNextResponse
 * @returns {boolean} returns.success - 処理の成功可否
 * @returns {SkillTagMap[]} returns.data - スキルタグマップデータの配列
 * @returns {string} returns.data[].skillId - スキルID
 * @returns {string} returns.data[].tagId - タグID
 * @returns {Skill} returns.data[].skill - 関連スキル情報（ID、名前、説明、アイコン、カテゴリーID）
 * @returns {SkillTag} returns.data[].tag - 関連タグ情報（ID、名前、説明）
 * @returns {string} returns.error - エラーメッセージ（失敗時のみ）
 *
 * @throws {500} データベースアクセスエラーやその他の内部エラーが発生した場合
 *
 * @example
 * ```
 * GET /api/skills/tag-maps
 * Response: {
 *   "success": true,
 *   "data": [
 *     {
 *       "skillId": "react",
 *       "tagId": "ui-library",
 *       "skill": {
 *         "id": "react",
 *         "label": "React",
 *         "description": "JavaScriptライブラリ",
 *         "deviconId": "react",
 *         "categoryId": "frontend"
 *       },
 *       "tag": {
 *         "id": "ui-library",
 *         "label": "UIライブラリ",
 *         "description": "ユーザーインターフェース構築ライブラリ"
 *       }
 *     }
 *   ]
 * }
 *
 * GET /api/skills/tag-maps?skillId=react
 * Response: { “success”: true, “data”: [ reactに関連付けられたタグのみ ] }
 * ```
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const skillId = searchParams.get('skillId');
    const tagId = searchParams.get('tagId');

    let whereClause = {};

    if (skillId) {
      whereClause = { skillId };
    } else if (tagId) {
      whereClause = { tagId };
    }

    const tagMaps = await prisma.skillTagMap.findMany({
      where: whereClause,
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
        tag: {
          select: {
            id: true,
            label: true,
            description: true,
          },
        },
      },
      orderBy: [{ skillId: 'asc' }, { tagId: 'asc' }],
    });

    return NextResponse.json({
      success: true,
      data: tagMaps,
    });
  } catch (error) {
    console.error('Error fetching skill tag maps:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch skill tag maps',
      },
      { status: 500 }
    );
  }
}

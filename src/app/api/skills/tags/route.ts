import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

/**
 * 全スキルタグ一覧を取得するAPI
 *
 * @description システムに登録されている全てのスキルタグ情報を取得します。
 * 各タグに関連付けられたスキルの簡略情報（ID、名前）も含まれ、IDの昇順でソートされて返却されます。
 *
 * @returns {Promise<NextResponse>} 処理結果を含むNextResponse
 * @returns {boolean} returns.success - 処理の成功可否
 * @returns {SkillTag[]} returns.data - スキルタグデータの配列
 * @returns {string} returns.data[].id - タグID
 * @returns {string} returns.data[].label - タグ名
 * @returns {string} returns.data[].description - タグ説明
 * @returns {Skill[]} returns.data[].skills - タグに関連付けられたスキル一覧（ID、名前のみ）
 * @returns {string} returns.error - エラーメッセージ（失敗時のみ）
 *
 * @throws {500} データベースアクセスエラーやその他の内部エラーが発生した場合
 *
 * @example
 * ```
 * GET /api/skills/tags
 * Response: {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": "ui-library",
 *       "label": "UIライブラリ",
 *       "description": "ユーザーインターフェース構築ライブラリ",
 *       "skills": [
 *         { "id": "react", "label": "React" },
 *         { "id": "vue", "label": "Vue.js" }
 *       ]
 *     },
 *     {
 *       "id": "state-management",
 *       "label": "状態管理",
 *       "description": "アプリケーション状態管理ツール",
 *       "skills": [
 *         { "id": "redux", "label": "Redux" }
 *       ]
 *     }
 *   ]
 * }
 * ```
 */
export async function GET() {
  try {
    const tags = await prisma.skillTag.findMany({
      include: {
        skillTagMaps: {
          include: {
            skill: {
              select: {
                id: true,
                label: true,
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

    return NextResponse.json({
      success: true,
      data: tagsWithSkills,
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

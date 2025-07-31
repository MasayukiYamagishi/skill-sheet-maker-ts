import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

/**
 * 全スキルカテゴリ一覧を取得するAPI
 *
 * @description システムに登録されている全てのスキルカテゴリ情報を取得します。
 * 各カテゴリに属するスキルの簡略情報（ID、名前）も含まれ、IDの昇順でソートされて返却されます。
 *
 * @returns {Promise<NextResponse>} 処理結果を含むNextResponse
 * @returns {boolean} returns.success - 処理の成功可否
 * @returns {SkillCategory[]} returns.data - スキルカテゴリデータの配列
 * @returns {string} returns.data[].id - カテゴリーID
 * @returns {string} returns.data[].name - カテゴリ名
 * @returns {string} returns.data[].description - カテゴリ説明
 * @returns {Skill[]} returns.data[].skills - カテゴリに属するスキル一覧（ID、名前のみ）
 * @returns {string} returns.error - エラーメッセージ（失敗時のみ）
 *
 * @throws {500} データベースアクセスエラーやその他の内部エラーが発生した場合
 *
 * @example
 * ```
 * GET /api/skills/categories
 * Response: {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": "frontend",
 *       "name": "フロントエンド",
 *       "description": "UI/UX関連技術",
 *       "skills": [
 *         { "id": "react", "label": "React" },
 *         { "id": "vue", "label": "Vue.js" }
 *       ]
 *     },
 *     {
 *       "id": "backend",
 *       "name": "バックエンド",
 *       "description": "サーバーサイド技術",
 *       "skills": [
 *         { "id": "nodejs", "label": "Node.js" }
 *       ]
 *     }
 *   ]
 * }
 * ```
 */
export async function GET() {
  try {
    const categories = await prisma.skillCategory.findMany({
      include: {
        skills: {
          select: {
            id: true,
            label: true,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      data: categories,
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

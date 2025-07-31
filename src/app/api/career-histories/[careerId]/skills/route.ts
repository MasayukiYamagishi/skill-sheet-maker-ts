import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// 経歴スキル操作用のスキーマ
const careerSkillSchema = z.object({
  skillId: z.string().min(1),
  version: z.string().optional(),
});

const bulkCareerSkillSchema = z.object({
  skills: z.array(careerSkillSchema).min(1),
});

/**
 * 指定経歴の使用スキル一覧を取得するAPI
 *
 * @description 指定された経歴UUIDに関連付けられた全てのスキル情報を取得します。
 * スキルはカテゴリーID、ラベル名の順でソートされ、バージョン情報も含まれます。
 *
 * @param {NextRequest} request - Next.jsのリクエストオブジェクト
 * @param {object} params - ルートパラメータ
 * @param {string} params.careerId - 取得対象の経歴UUID
 *
 * @returns {Promise<NextResponse>} 処理結果を含むNextResponse
 * @returns {boolean} returns.success - 処理の成功可否
 * @returns {CareerSkill[]} returns.data - 経歴スキルデータの配列（スキル、カテゴリ、経歴情報含む）
 * @returns {string} returns.error - エラーメッセージ（失敗時のみ）
 *
 * @throws {500} データベースアクセスエラーやその他の内部エラーが発生した場合
 *
 * @example
 * ```
 * GET /api/career-histories/career-123/skills
 * Response: {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": "cs-001",
 *       "careerId": "career-123",
 *       "skillId": "skill-react",
 *       "version": "18.2.0",
 *       "skill": {
 *         "id": "skill-react",
 *         "label": "React",
 *         "category": { "id": "frontend", "name": "フロントエンド" }
 *       },
 *       "career": { "id": "career-123", "title": "ECサイト開発" }
 *     }
 *   ]
 * }
 * ```
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { careerId: string } }
) {
  try {
    const { careerId } = params;

    const careerSkills = await prisma.careerSkill.findMany({
      where: { careerId },
      include: {
        skill: {
          include: {
            category: true,
          },
        },
        career: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: [{ skill: { categoryId: 'asc' } }, { skill: { label: 'asc' } }],
    });

    return NextResponse.json({
      success: true,
      data: careerSkills,
    });
  } catch (error) {
    console.error('Error fetching career skills:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch career skills',
      },
      { status: 500 }
    );
  }
}

/**
 * 経歴にスキル情報をアップサート（作成または更新）するAPI
 *
 * @description 指定された経歴に対して1つまたは複数のスキル情報をアップサートします。
 * 既に存在するスキルの場合はバージョン情報を更新し、存在しない場合は新規作成します。
 *
 * @param {NextRequest} request - Next.jsのリクエストオブジェクト
 * @param {object} params - ルートパラメータ
 * @param {string} params.careerId - アップサート対象の経歴UUID
 * @param {object} body - リクエストボディ
 * @param {string} body.skillId - アップサートするスキルID（単一処理時）
 * @param {string} [body.version] - スキルのバージョン情報（例："18.2.0"）
 * @param {object[]} [body.skills] - 複数処理時のスキルデータ配列
 * @param {string} body.skills[].skillId - スキルID
 * @param {string} [body.skills[].version] - バージョン情報
 *
 * @returns {Promise<NextResponse>} 処理結果を含むNextResponse
 * @returns {boolean} returns.success - 処理の成功可否
 * @returns {CareerSkill[]} returns.data - アップサートされた経歴スキルデータの配列
 * @returns {string} returns.message - 処理結果メッセージ
 * @returns {string} returns.error - エラーメッセージ（失敗時のみ）
 *
 * @throws {400} リクエストボディのバリデーションエラーの場合
 * @throws {404} 指定された経歴が見つからない場合
 * @throws {500} データベースアクセスエラーやその他の内部エラーが発生した場合
 *
 * @example
 * ```
 * POST /api/career-histories/career-123/skills
 * Body: {
 *   "skills": [
 *     { "skillId": "skill-react", "version": "18.2.0" },
 *     { "skillId": "skill-typescript", "version": "5.0" }
 *   ]
 * }
 * Response: {
 *   "success": true,
 *   "data": [{ "id": "cs-001", "skillId": "skill-react", ... }],
 *   "message": "2 career skills processed"
 * }
 * ```
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { careerId: string } }
) {
  try {
    const { careerId } = params;
    const body = await request.json();

    let skillsData;
    if (Array.isArray(body.skills)) {
      skillsData = bulkCareerSkillSchema.parse(body).skills;
    } else {
      skillsData = [careerSkillSchema.parse(body)];
    }

    // Check if career exists
    const career = await prisma.careerHistory.findUnique({
      where: { id: careerId },
      select: { id: true },
    });

    if (!career) {
      return NextResponse.json(
        {
          success: false,
          error: 'Career history not found',
        },
        { status: 404 }
      );
    }

    const results = [];
    for (const skillData of skillsData) {
      const result = await prisma.careerSkill.upsert({
        where: {
          careerId_skillId: {
            careerId,
            skillId: skillData.skillId,
          },
        },
        update: {
          version: skillData.version,
        },
        create: {
          careerId,
          skillId: skillData.skillId,
          version: skillData.version,
        },
        include: {
          skill: {
            include: {
              category: true,
            },
          },
        },
      });
      results.push(result);
    }

    return NextResponse.json(
      {
        success: true,
        data: results,
        message: `${results.length} career skills processed`,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    console.error('Error upserting career skills:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to upsert career skills',
      },
      { status: 500 }
    );
  }
}

/**
 * 経歴からスキル情報を削除するAPI
 *
 * @description 指定された経歴から指定されたスキルID群に対応するスキル情報を削除します。
 * 複数のスキルを一度に削除することも可能です。
 *
 * @param {NextRequest} request - Next.jsのリクエストオブジェクト
 * @param {object} params - ルートパラメータ
 * @param {string} params.careerId - 削除対象の経歴UUID
 * @param {object} body - リクエストボディ
 * @param {string[]} body.skillIds - 削除するスキルIDの配列
 *
 * @returns {Promise<NextResponse>} 処理結果を含むNextResponse
 * @returns {boolean} returns.success - 処理の成功可否
 * @returns {string} returns.message - 処理結果メッセージ
 * @returns {number} returns.deletedCount - 実際に削除された件数
 * @returns {string} returns.error - エラーメッセージ（失敗時のみ）
 *
 * @throws {400} リクエストボディのバリデーションエラーの場合
 * @throws {500} データベースアクセスエラーやその他の内部エラーが発生した場合
 *
 * @example
 * ```
 * DELETE /api/career-histories/career-123/skills
 * Body: {
 *   "skillIds": ["skill-react", "skill-vue"]
 * }
 * Response: {
 *   "success": true,
 *   "message": "2 career skills deleted",
 *   "deletedCount": 2
 * }
 * ```
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { careerId: string } }
) {
  try {
    const { careerId } = params;
    const body = await request.json();
    const { skillIds } = z
      .object({
        skillIds: z.array(z.string()).min(1),
      })
      .parse(body);

    const result = await prisma.careerSkill.deleteMany({
      where: {
        careerId,
        skillId: {
          in: skillIds,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `${result.count} career skills deleted`,
      deletedCount: result.count,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    console.error('Error deleting career skills:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete career skills',
      },
      { status: 500 }
    );
  }
}

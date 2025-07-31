import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// ユーザースキル操作用のスキーマ
const userSkillSchema = z.object({
  skillId: z.string().min(1),
  version: z.string().optional(),
});

const bulkUserSkillSchema = z.object({
  skills: z.array(userSkillSchema).min(1),
});

/**
 * 指定ユーザーのスキル一覧を取得するAPI
 *
 * @description 指定されたユーザーIDのスキル情報を取得します。
 * スキルのカテゴリ、タグ情報も同時に取得します。
 *
 * @param {NextRequest} request - Next.jsのリクエストオブジェクト
 * @param {object} params - ルートパラメータ
 * @param {string} params.id - スキルを取得したいユーザーのUUID
 *
 * @returns {Promise<NextResponse>} ユーザースキル一覧を含むJSON レスポンス
 * @returns {boolean} returns.success - 処理の成功可否
 * @returns {UserSkill[]} returns.data - ユーザースキル情報の配列
 *
 * @throws {404} 指定IDのユーザーが存在しない場合
 * @throws {500} サーバー内部エラーの場合
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: userId } = params;

    // ユーザーの存在チェック
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    const userSkills = await prisma.userSkill.findMany({
      where: { userId },
      include: {
        skill: {
          include: {
            category: true,
            skillTagMaps: {
              include: {
                tag: true,
              },
            },
          },
        },
      },
      orderBy: [{ skill: { categoryId: 'asc' } }, { skill: { label: 'asc' } }],
    });

    // Transform to include tags directly
    const skillsWithTags = userSkills.map((userSkill) => ({
      ...userSkill,
      skill: {
        ...userSkill.skill,
        tags: userSkill.skill.skillTagMaps.map((tagMap) => tagMap.tag),
        skillTagMaps: undefined,
      },
    }));

    return NextResponse.json({
      success: true,
      data: skillsWithTags,
    });
  } catch (error) {
    console.error('Error fetching user skills:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch user skills',
      },
      { status: 500 }
    );
  }
}

// POST /api/users/[id]/skills - ユーザースキル新規登録
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: userId } = params;
    const body = await request.json();

    // 単一スキルと一括スキルの両方に対応
    let skillsData;
    if (Array.isArray(body.skills)) {
      skillsData = bulkUserSkillSchema.parse(body).skills;
    } else {
      skillsData = [userSkillSchema.parse(body)];
    }

    // ユーザーの存在チェック
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    // スキルの存在チェック
    const skillIds = skillsData.map((skill) => skill.skillId);
    const existingSkills = await prisma.skill.findMany({
      where: { id: { in: skillIds } },
      select: { id: true },
    });

    const existingSkillIds = existingSkills.map((skill) => skill.id);
    const notFoundSkills = skillIds.filter(
      (id) => !existingSkillIds.includes(id)
    );

    if (notFoundSkills.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Some skills not found',
          notFoundSkills,
        },
        { status: 404 }
      );
    }

    // Use upsert to handle duplicates (skip existing ones)
    const results = [];
    // 各スキルをアップサート処理（新規作成または更新）
    for (const skillData of skillsData) {
      const result = await prisma.userSkill.upsert({
        where: {
          userId_skillId: {
            userId,
            skillId: skillData.skillId,
          },
        },
        update: {
          version: skillData.version,
        },
        create: {
          userId,
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
        message: `${results.length} user skills processed`,
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

    console.error('Error creating user skills:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create user skills',
      },
      { status: 500 }
    );
  }
}

// PUT /api/users/[userId]/skills - update_user_skill
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: userId } = params;
    const body = await request.json();

    let skillsData;
    if (Array.isArray(body.skills)) {
      skillsData = bulkUserSkillSchema.parse(body).skills;
    } else {
      skillsData = [userSkillSchema.parse(body)];
    }

    const results = [];
    for (const skillData of skillsData) {
      const existingUserSkill = await prisma.userSkill.findUnique({
        where: {
          userId_skillId: {
            userId,
            skillId: skillData.skillId,
          },
        },
      });

      if (!existingUserSkill) {
        return NextResponse.json(
          {
            success: false,
            error: `User skill not found: ${skillData.skillId}`,
          },
          { status: 404 }
        );
      }

      const result = await prisma.userSkill.update({
        where: {
          userId_skillId: {
            userId,
            skillId: skillData.skillId,
          },
        },
        data: {
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

    return NextResponse.json({
      success: true,
      data: results,
      message: `${results.length} user skills updated`,
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

    console.error('Error updating user skills:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update user skills',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[userId]/skills - delete_user_skills
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: userId } = params;
    const body = await request.json();
    const { skillIds } = z
      .object({
        skillIds: z.array(z.string()).min(1),
      })
      .parse(body);

    const result = await prisma.userSkill.deleteMany({
      where: {
        userId,
        skillId: {
          in: skillIds,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `${result.count} user skills deleted`,
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

    console.error('Error deleting user skills:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete user skills',
      },
      { status: 500 }
    );
  }
}

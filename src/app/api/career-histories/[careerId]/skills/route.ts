import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// 経歴スキル操作用のスキーマ
const careerSkillSchema = z.object({
  skillId: z.string().min(1),
  version: z.string().optional(),
});

const bulkCareerSkillSchema = z.object({
  skills: z.array(careerSkillSchema).min(1),
});

// GET /api/career-histories/[careerId]/skills - 指定経歴IDのスキル一覧取得
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

// POST /api/career-histories/[careerId]/skills - upsert_career_skills
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

// DELETE /api/career-histories/[careerId]/skills - delete_career_skills
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

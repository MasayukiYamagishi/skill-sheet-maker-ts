import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// 経歴情報操作用のスキーマ
const careerHistorySchema = z.object({
  title: z.string().min(1),
  startedAt: z
    .string()
    .optional()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: 'Invalid date format',
    }),
  endedAt: z
    .string()
    .optional()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: 'Invalid date format',
    }),
  description: z.string().optional(),
  role: z.string().optional(),
  scale: z.string().optional(),
});

const bulkCareerHistorySchema = z.object({
  careerHistories: z.array(careerHistorySchema).min(1),
});

// GET /api/users/[userId]/career-histories - 指定ユーザーIDの経歴情報取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: userId } = params;

    // Check if user exists
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

    const careerHistories = await prisma.careerHistory.findMany({
      where: { userId },
      include: {
        careerSkills: {
          include: {
            skill: {
              include: {
                category: true,
              },
            },
          },
        },
        careerProcesses: {
          include: {
            process: true,
          },
        },
      },
      orderBy: {
        startedAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: careerHistories,
    });
  } catch (error) {
    console.error('Error fetching career histories:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch career histories',
      },
      { status: 500 }
    );
  }
}

// POST /api/users/[userId]/career-histories - insert_career_histories
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: userId } = params;
    const body = await request.json();

    let careerHistoriesData;
    if (Array.isArray(body.careerHistories)) {
      careerHistoriesData = bulkCareerHistorySchema.parse(body).careerHistories;
    } else {
      careerHistoriesData = [careerHistorySchema.parse(body)];
    }

    // Check if user exists
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

    const results = [];
    for (const careerData of careerHistoriesData) {
      const result = await prisma.careerHistory.create({
        data: {
          userId,
          title: careerData.title,
          startedAt: careerData.startedAt
            ? new Date(careerData.startedAt)
            : null,
          endedAt: careerData.endedAt ? new Date(careerData.endedAt) : null,
          description: careerData.description,
          role: careerData.role,
          scale: careerData.scale,
        },
        include: {
          careerSkills: {
            include: {
              skill: true,
            },
          },
          careerProcesses: {
            include: {
              process: true,
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
        message: `${results.length} career histories created`,
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

    console.error('Error creating career histories:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create career histories',
      },
      { status: 500 }
    );
  }
}

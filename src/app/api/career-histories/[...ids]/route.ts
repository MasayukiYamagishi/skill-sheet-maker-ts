import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// 経歴情報更新用のスキーマ
const updateCareerHistorySchema = z.object({
  title: z.string().min(1).optional(),
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

// GET /api/career-histories/[...ids] - 指定経歴ID群の経歴情報取得
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ids: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const idsParam = resolvedParams.ids.join('/');
    const careerIds = idsParam.includes(',')
      ? idsParam.split(',').map((id) => id.trim())
      : [idsParam];

    const careerHistories = await prisma.careerHistory.findMany({
      where: {
        id: {
          in: careerIds,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
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

    const foundIds = careerHistories.map((career) => career.id);
    const notFoundIds = careerIds.filter((id) => !foundIds.includes(id));

    if (notFoundIds.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Some career histories not found',
          notFoundIds,
          data: careerHistories,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: careerIds.length === 1 ? careerHistories[0] : careerHistories,
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

// PUT /api/career-histories/[...ids] - update_career_histories
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ ids: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const careerIds = resolvedParams.ids;
    const body = await request.json();

    // Handle both single and bulk updates
    let updatesData;
    if (Array.isArray(body)) {
      if (body.length !== careerIds.length) {
        return NextResponse.json(
          {
            success: false,
            error: 'Number of IDs and update data must match',
          },
          { status: 400 }
        );
      }
      updatesData = body.map((update) =>
        updateCareerHistorySchema.parse(update)
      );
    } else {
      if (careerIds.length !== 1) {
        return NextResponse.json(
          {
            success: false,
            error: 'Single update data provided for multiple IDs',
          },
          { status: 400 }
        );
      }
      updatesData = [updateCareerHistorySchema.parse(body)];
    }

    const results = [];
    for (let i = 0; i < careerIds.length; i++) {
      const careerId = careerIds[i];
      const updateData = updatesData[i];

      const existingCareer = await prisma.careerHistory.findUnique({
        where: { id: careerId },
      });

      if (!existingCareer) {
        return NextResponse.json(
          {
            success: false,
            error: `Career history not found: ${careerId}`,
          },
          { status: 404 }
        );
      }

      const result = await prisma.careerHistory.update({
        where: { id: careerId },
        data: {
          ...updateData,
          startedAt: updateData.startedAt
            ? new Date(updateData.startedAt)
            : undefined,
          endedAt: updateData.endedAt
            ? new Date(updateData.endedAt)
            : updateData.endedAt === null
              ? null
              : undefined,
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

    return NextResponse.json({
      success: true,
      data: results.length === 1 ? results[0] : results,
      message: `${results.length} career histories updated`,
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

    console.error('Error updating career histories:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update career histories',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/career-histories/[...ids] - delete_career_histories
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ ids: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const careerIds = resolvedParams.ids;

    // Check if all career histories exist
    const existingCareers = await prisma.careerHistory.findMany({
      where: { id: { in: careerIds } },
      select: { id: true },
    });

    const foundIds = existingCareers.map((career) => career.id);
    const notFoundIds = careerIds.filter((id) => !foundIds.includes(id));

    if (notFoundIds.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Some career histories not found',
          notFoundIds,
        },
        { status: 404 }
      );
    }

    const result = await prisma.careerHistory.deleteMany({
      where: {
        id: {
          in: careerIds,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `${result.count} career histories deleted`,
      deletedCount: result.count,
    });
  } catch (error) {
    console.error('Error deleting career histories:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete career histories',
      },
      { status: 500 }
    );
  }
}

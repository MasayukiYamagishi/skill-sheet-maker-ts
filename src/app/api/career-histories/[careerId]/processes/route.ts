import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// 経歴担当工程操作用のスキーマ
const careerProcessSchema = z.object({
  processIds: z.array(z.number().int().positive()).min(1),
});

// GET /api/career-histories/[careerId]/processes - 指定経歴IDの担当工程一覧取得
export async function GET(
  request: NextRequest,
  { params }: { params: { careerId: string } }
) {
  try {
    const { careerId } = params;

    const careerProcesses = await prisma.careerProcess.findMany({
      where: { careerId },
      include: {
        process: true,
        career: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        processId: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      data: careerProcesses,
    });
  } catch (error) {
    console.error('Error fetching career processes:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch career processes',
      },
      { status: 500 }
    );
  }
}

// POST /api/career-histories/[careerId]/processes - upsert_career_processes
export async function POST(
  request: NextRequest,
  { params }: { params: { careerId: string } }
) {
  try {
    const { careerId } = params;
    const body = await request.json();
    const { processIds } = careerProcessSchema.parse(body);

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

    // Check if processes exist
    const existingProcesses = await prisma.masterProcess.findMany({
      where: { id: { in: processIds } },
      select: { id: true },
    });

    const existingProcessIds = existingProcesses.map((p) => p.id);
    const notFoundProcesses = processIds.filter(
      (id) => !existingProcessIds.includes(id)
    );

    if (notFoundProcesses.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Some processes not found',
          notFoundProcesses,
        },
        { status: 404 }
      );
    }

    // First, remove all existing processes for this career
    await prisma.careerProcess.deleteMany({
      where: { careerId },
    });

    // Then add the new processes
    const results = [];
    for (const processId of processIds) {
      const result = await prisma.careerProcess.create({
        data: {
          careerId,
          processId,
        },
        include: {
          process: true,
        },
      });
      results.push(result);
    }

    return NextResponse.json(
      {
        success: true,
        data: results,
        message: `${results.length} career processes set`,
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

    console.error('Error upserting career processes:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to upsert career processes',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/career-histories/[careerId]/processes - delete_career_processes
export async function DELETE(
  request: NextRequest,
  { params }: { params: { careerId: string } }
) {
  try {
    const { careerId } = params;
    const body = await request.json();
    const { processIds } = z
      .object({
        processIds: z.array(z.number().int().positive()).min(1),
      })
      .parse(body);

    const result = await prisma.careerProcess.deleteMany({
      where: {
        careerId,
        processId: {
          in: processIds,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `${result.count} career processes deleted`,
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

    console.error('Error deleting career processes:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete career processes',
      },
      { status: 500 }
    );
  }
}

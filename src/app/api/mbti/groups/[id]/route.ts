import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/mbti/groups/[id] - fetch_mbti_group_by_id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const mbtiGroup = await prisma.mbtiGroup.findUnique({
      where: { id },
      include: {
        mbtiTypes: {
          select: {
            code: true,
            name: true,
            nameEn: true,
            description: true,
          },
        },
      },
    });

    if (!mbtiGroup) {
      return NextResponse.json(
        {
          success: false,
          error: 'MBTI group not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: mbtiGroup,
    });
  } catch (error) {
    console.error('Error fetching MBTI group:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch MBTI group',
      },
      { status: 500 }
    );
  }
}

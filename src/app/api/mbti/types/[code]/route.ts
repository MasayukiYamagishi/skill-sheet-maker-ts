import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/mbti/types/[code] - fetch_mbti_detail_by_type
export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params;

    const mbtiType = await prisma.mbtiType.findUnique({
      where: { code: code.toUpperCase() },
      include: {
        group: true,
        users: {
          select: {
            id: true,
            name: true,
            mbtiIdentity: true,
            mbtiIdentityRef: {
              select: {
                label: true,
                description: true,
              },
            },
          },
        },
      },
    });

    if (!mbtiType) {
      return NextResponse.json(
        {
          success: false,
          error: 'MBTI type not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: mbtiType,
    });
  } catch (error) {
    console.error('Error fetching MBTI type:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch MBTI type',
      },
      { status: 500 }
    );
  }
}

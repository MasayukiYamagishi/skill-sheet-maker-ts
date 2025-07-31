import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/mbti/identities/[code] - fetch_mbti_identity_by_code
export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params;

    if (!['A', 'T'].includes(code.toUpperCase())) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid MBTI identity code. Must be A or T',
        },
        { status: 400 }
      );
    }

    const mbtiIdentity = await prisma.mbtiIdentity.findUnique({
      where: { code: code.toUpperCase() },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            mbtiType: true,
            mbtiTypeRef: {
              select: {
                name: true,
                description: true,
              },
            },
          },
        },
      },
    });

    if (!mbtiIdentity) {
      return NextResponse.json(
        {
          success: false,
          error: 'MBTI identity not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: mbtiIdentity,
    });
  } catch (error) {
    console.error('Error fetching MBTI identity:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch MBTI identity',
      },
      { status: 500 }
    );
  }
}

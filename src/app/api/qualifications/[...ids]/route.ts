import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/qualifications/[...ids] - fetch_qualification_by_ids
export async function GET(
  request: NextRequest,
  { params }: { params: { ids: string[] } }
) {
  try {
    const idsParam = params.ids.join('/');
    const qualificationIds = idsParam.includes(',')
      ? idsParam.split(',').map((id) => id.trim())
      : [idsParam];

    const qualifications = await prisma.qualification.findMany({
      where: {
        id: {
          in: qualificationIds,
        },
      },
      include: {
        userQualifications: {
          select: {
            userId: true,
            acquiredAt: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: [{ isNational: 'desc' }, { name: 'asc' }],
    });

    const foundIds = qualifications.map((qualification) => qualification.id);
    const notFoundIds = qualificationIds.filter((id) => !foundIds.includes(id));

    if (notFoundIds.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Some qualifications not found',
          notFoundIds,
          data: qualifications,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: qualificationIds.length === 1 ? qualifications[0] : qualifications,
    });
  } catch (error) {
    console.error('Error fetching qualifications:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch qualifications',
      },
      { status: 500 }
    );
  }
}

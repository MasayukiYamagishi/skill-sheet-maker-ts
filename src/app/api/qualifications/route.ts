import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/qualifications - fetch_all_qualifications
export async function GET() {
  try {
    const qualifications = await prisma.qualification.findMany({
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
      orderBy: [
        { isNational: 'desc' }, // National qualifications first
        { name: 'asc' },
      ],
    });

    return NextResponse.json({
      success: true,
      data: qualifications,
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

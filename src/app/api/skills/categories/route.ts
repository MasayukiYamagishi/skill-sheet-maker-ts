import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/skills/categories - fetch_all_skill_categories
export async function GET() {
  try {
    const categories = await prisma.skillCategory.findMany({
      include: {
        skills: {
          select: {
            id: true,
            label: true,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Error fetching skill categories:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch skill categories',
      },
      { status: 500 }
    );
  }
}

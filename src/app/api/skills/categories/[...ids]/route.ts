import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/skills/categories/[...ids] - fetch_skill_category_by_id
export async function GET(
  request: NextRequest,
  { params }: { params: { ids: string[] } }
) {
  try {
    const idsParam = params.ids.join('/');
    const categoryIds = idsParam.includes(',')
      ? idsParam.split(',').map((id) => id.trim())
      : [idsParam];

    const categories = await prisma.skillCategory.findMany({
      where: {
        id: {
          in: categoryIds,
        },
      },
      include: {
        skills: {
          select: {
            id: true,
            label: true,
            description: true,
            deviconId: true,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });

    const foundIds = categories.map((category) => category.id);
    const notFoundIds = categoryIds.filter((id) => !foundIds.includes(id));

    if (notFoundIds.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Some categories not found',
          notFoundIds,
          data: categories,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: categoryIds.length === 1 ? categories[0] : categories,
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

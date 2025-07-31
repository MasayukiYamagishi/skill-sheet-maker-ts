import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/skills/tag-maps - fetch_all_skill_tag_maps
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const skillId = searchParams.get('skillId');
    const tagId = searchParams.get('tagId');

    let whereClause = {};

    if (skillId) {
      whereClause = { skillId };
    } else if (tagId) {
      whereClause = { tagId };
    }

    const tagMaps = await prisma.skillTagMap.findMany({
      where: whereClause,
      include: {
        skill: {
          select: {
            id: true,
            label: true,
            description: true,
            deviconId: true,
            categoryId: true,
          },
        },
        tag: {
          select: {
            id: true,
            label: true,
            description: true,
          },
        },
      },
      orderBy: [{ skillId: 'asc' }, { tagId: 'asc' }],
    });

    return NextResponse.json({
      success: true,
      data: tagMaps,
    });
  } catch (error) {
    console.error('Error fetching skill tag maps:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch skill tag maps',
      },
      { status: 500 }
    );
  }
}

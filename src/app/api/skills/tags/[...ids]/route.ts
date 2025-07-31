import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/skills/tags/[...ids] - fetch_skill_tag_by_id
export async function GET(
  request: NextRequest,
  { params }: { params: { ids: string[] } }
) {
  try {
    const idsParam = params.ids.join('/');
    const tagIds = idsParam.includes(',')
      ? idsParam.split(',').map((id) => id.trim())
      : [idsParam];

    const tags = await prisma.skillTag.findMany({
      where: {
        id: {
          in: tagIds,
        },
      },
      include: {
        skillTagMaps: {
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
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });

    // Transform to include skills directly
    const tagsWithSkills = tags.map((tag) => ({
      ...tag,
      skills: tag.skillTagMaps.map((tagMap) => tagMap.skill),
      skillTagMaps: undefined,
    }));

    const foundIds = tags.map((tag) => tag.id);
    const notFoundIds = tagIds.filter((id) => !foundIds.includes(id));

    if (notFoundIds.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Some tags not found',
          notFoundIds,
          data: tagsWithSkills,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: tagIds.length === 1 ? tagsWithSkills[0] : tagsWithSkills,
    });
  } catch (error) {
    console.error('Error fetching skill tags:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch skill tags',
      },
      { status: 500 }
    );
  }
}

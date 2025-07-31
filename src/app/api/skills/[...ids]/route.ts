import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/skills/[...ids] - fetch_skill_by_ids
// Supports both single ID and multiple IDs: /api/skills/id1 or /api/skills/id1,id2,id3
export async function GET(
  request: NextRequest,
  { params }: { params: { ids: string[] } }
) {
  try {
    // Handle both single ID and comma-separated IDs
    const idsParam = params.ids.join('/');
    const skillIds = idsParam.includes(',')
      ? idsParam.split(',').map((id) => id.trim())
      : [idsParam];

    const skills = await prisma.skill.findMany({
      where: {
        id: {
          in: skillIds,
        },
      },
      include: {
        category: true,
        skillTagMaps: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: [{ categoryId: 'asc' }, { label: 'asc' }],
    });

    // Transform the data to include tags directly
    const skillsWithTags = skills.map((skill) => ({
      ...skill,
      tags: skill.skillTagMaps.map((tagMap) => tagMap.tag),
      skillTagMaps: undefined,
    }));

    // Check if all requested skills were found
    const foundIds = skills.map((skill) => skill.id);
    const notFoundIds = skillIds.filter((id) => !foundIds.includes(id));

    if (notFoundIds.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Some skills not found',
          notFoundIds,
          data: skillsWithTags,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: skillIds.length === 1 ? skillsWithTags[0] : skillsWithTags,
    });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch skills',
      },
      { status: 500 }
    );
  }
}

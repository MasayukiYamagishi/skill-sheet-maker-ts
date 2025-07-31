import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/skills/tags - fetch_all_skill_tags
export async function GET() {
  try {
    const tags = await prisma.skillTag.findMany({
      include: {
        skillTagMaps: {
          include: {
            skill: {
              select: {
                id: true,
                label: true,
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

    return NextResponse.json({
      success: true,
      data: tagsWithSkills,
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

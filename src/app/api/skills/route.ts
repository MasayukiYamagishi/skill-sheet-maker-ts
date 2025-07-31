import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/skills - fetch_all_skills
export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
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
      skillTagMaps: undefined, // Remove the nested structure
    }));

    return NextResponse.json({
      success: true,
      data: skillsWithTags,
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

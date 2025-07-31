import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Schema for user qualification operations
const userQualificationSchema = z.object({
  qualificationId: z.string().min(1),
  acquiredAt: z
    .string()
    .optional()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: 'Invalid date format',
    }),
});

const bulkUserQualificationSchema = z.object({
  qualifications: z.array(userQualificationSchema).min(1),
});

// GET /api/users/[userId]/qualifications - fetch_user_qualifications_by_user_id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: userId } = params;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    const userQualifications = await prisma.userQualification.findMany({
      where: { userId },
      include: {
        qualification: true,
      },
      orderBy: [
        { qualification: { isNational: 'desc' } },
        { qualification: { name: 'asc' } },
      ],
    });

    return NextResponse.json({
      success: true,
      data: userQualifications,
    });
  } catch (error) {
    console.error('Error fetching user qualifications:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch user qualifications',
      },
      { status: 500 }
    );
  }
}

// POST /api/users/[userId]/qualifications - insert_user_qualifications
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: userId } = params;
    const body = await request.json();

    let qualificationsData;
    if (Array.isArray(body.qualifications)) {
      qualificationsData =
        bulkUserQualificationSchema.parse(body).qualifications;
    } else {
      qualificationsData = [userQualificationSchema.parse(body)];
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    // Check if qualifications exist
    const qualificationIds = qualificationsData.map((q) => q.qualificationId);
    const existingQualifications = await prisma.qualification.findMany({
      where: { id: { in: qualificationIds } },
      select: { id: true },
    });

    const existingQualificationIds = existingQualifications.map((q) => q.id);
    const notFoundQualifications = qualificationIds.filter(
      (id) => !existingQualificationIds.includes(id)
    );

    if (notFoundQualifications.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Some qualifications not found',
          notFoundQualifications,
        },
        { status: 404 }
      );
    }

    const results = [];
    for (const qualificationData of qualificationsData) {
      try {
        const result = await prisma.userQualification.create({
          data: {
            userId,
            qualificationId: qualificationData.qualificationId,
            acquiredAt: qualificationData.acquiredAt
              ? new Date(qualificationData.acquiredAt)
              : null,
          },
          include: {
            qualification: true,
          },
        });
        results.push(result);
      } catch (error: any) {
        // Skip duplicates (unique constraint violation)
        if (error.code === 'P2002') {
          continue;
        }
        throw error;
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: results,
        message: `${results.length} user qualifications created`,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    console.error('Error creating user qualifications:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create user qualifications',
      },
      { status: 500 }
    );
  }
}

// PUT /api/users/[userId]/qualifications - upsert_user_qualification
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: userId } = params;
    const body = await request.json();

    let qualificationsData;
    if (Array.isArray(body.qualifications)) {
      qualificationsData =
        bulkUserQualificationSchema.parse(body).qualifications;
    } else {
      qualificationsData = [userQualificationSchema.parse(body)];
    }

    const results = [];
    for (const qualificationData of qualificationsData) {
      const result = await prisma.userQualification.upsert({
        where: {
          userId_qualificationId: {
            userId,
            qualificationId: qualificationData.qualificationId,
          },
        },
        update: {
          acquiredAt: qualificationData.acquiredAt
            ? new Date(qualificationData.acquiredAt)
            : null,
        },
        create: {
          userId,
          qualificationId: qualificationData.qualificationId,
          acquiredAt: qualificationData.acquiredAt
            ? new Date(qualificationData.acquiredAt)
            : null,
        },
        include: {
          qualification: true,
        },
      });
      results.push(result);
    }

    return NextResponse.json({
      success: true,
      data: results,
      message: `${results.length} user qualifications processed`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    console.error('Error upserting user qualifications:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to upsert user qualifications',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[userId]/qualifications - delete_user_qualifications
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: userId } = params;
    const body = await request.json();
    const { qualificationIds } = z
      .object({
        qualificationIds: z.array(z.string()).min(1),
      })
      .parse(body);

    const result = await prisma.userQualification.deleteMany({
      where: {
        userId,
        qualificationId: {
          in: qualificationIds,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `${result.count} user qualifications deleted`,
      deletedCount: result.count,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    console.error('Error deleting user qualifications:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete user qualifications',
      },
      { status: 500 }
    );
  }
}

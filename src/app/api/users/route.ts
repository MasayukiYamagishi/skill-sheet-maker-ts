import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for user creation/update
const createUserSchema = z.object({
  userIdentifier: z.string().min(1),
  name: z.string().min(1),
  nameKana: z.string().min(1),
  birthDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
  gender: z.enum(['male', 'female', 'other']),
  email: z.string().email(),
  mbtiType: z.string().optional(),
  mbtiIdentity: z.string().optional(),
  joinedAt: z
    .string()
    .optional()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: 'Invalid date format',
    }),
  retiredAt: z
    .string()
    .optional()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: 'Invalid date format',
    }),
  finalEducation: z.string().optional(),
  status: z.enum(['inProject', 'available', 'onLeave', 'retired']),
  affiliation: z.string().optional(),
  avatarPath: z.string().optional(),
  githubUrl: z.string().url().optional().or(z.literal('')),
  prText: z.string().optional(),
  specialty: z.string().optional(),
  techStrength: z.string().optional(),
  salesComment: z.string().optional(),
  toeicScore: z.number().int().min(0).max(990).optional(),
  otherSkills: z.string().optional(),
});

// GET /api/users - fetch_all_users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        mbtiTypeRef: true,
        mbtiIdentityRef: true,
        userSkills: {
          include: {
            skill: {
              include: {
                category: true,
              },
            },
          },
        },
        userQualifications: {
          include: {
            qualification: true,
          },
        },
        careerHistories: {
          include: {
            careerSkills: {
              include: {
                skill: true,
              },
            },
            careerProcesses: {
              include: {
                process: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch users',
      },
      { status: 500 }
    );
  }
}

// POST /api/users - insert_user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createUserSchema.parse(body);

    // Check for duplicate userIdentifier or email
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { userIdentifier: validatedData.userIdentifier },
          { email: validatedData.email },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'User with this identifier or email already exists',
        },
        { status: 409 }
      );
    }

    const newUser = await prisma.user.create({
      data: {
        ...validatedData,
        birthDate: new Date(validatedData.birthDate),
        joinedAt: validatedData.joinedAt
          ? new Date(validatedData.joinedAt)
          : null,
        retiredAt: validatedData.retiredAt
          ? new Date(validatedData.retiredAt)
          : null,
      },
      include: {
        mbtiTypeRef: true,
        mbtiIdentityRef: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: newUser,
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

    console.error('Error creating user:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create user',
      },
      { status: 500 }
    );
  }
}

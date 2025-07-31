import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// ユーザー更新用のバリデーションスキーマ
const updateUserSchema = z.object({
  userIdentifier: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  nameKana: z.string().min(1).optional(),
  birthDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid date format',
    })
    .optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  email: z.string().email().optional(),
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
  status: z.enum(['inProject', 'available', 'onLeave', 'retired']).optional(),
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

// GET /api/users/[id] - 指定IDのユーザー情報取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // 指定IDのユーザー情報を関連データと共に取得
    const user = await prisma.user.findUnique({
      where: { id },
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
          orderBy: {
            startedAt: 'desc',
          },
        },
      },
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

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch user',
      },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - 指定IDのユーザー情報更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    // リクエストボディの取得とバリデーション
    const body = await request.json();
    const validatedData = updateUserSchema.parse(body);

    // 更新対象ユーザーの存在チェック
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    // ユーザー識別子とメールアドレスの重複チェック（現在のユーザーを除く）
    if (validatedData.userIdentifier || validatedData.email) {
      const duplicateUser = await prisma.user.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [
                validatedData.userIdentifier
                  ? { userIdentifier: validatedData.userIdentifier }
                  : {},
                validatedData.email ? { email: validatedData.email } : {},
              ].filter((condition) => Object.keys(condition).length > 0),
            },
          ],
        },
      });

      if (duplicateUser) {
        return NextResponse.json(
          {
            success: false,
            error: 'User with this identifier or email already exists',
          },
          { status: 409 }
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...validatedData,
        birthDate: validatedData.birthDate
          ? new Date(validatedData.birthDate)
          : undefined,
        joinedAt: validatedData.joinedAt
          ? new Date(validatedData.joinedAt)
          : validatedData.joinedAt === null
            ? null
            : undefined,
        retiredAt: validatedData.retiredAt
          ? new Date(validatedData.retiredAt)
          : validatedData.retiredAt === null
            ? null
            : undefined,
      },
      include: {
        mbtiTypeRef: true,
        mbtiIdentityRef: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    console.error('Error updating user:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update user',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - 指定IDのユーザー削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // 削除対象ユーザーの存在チェック
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete user',
      },
      { status: 500 }
    );
  }
}

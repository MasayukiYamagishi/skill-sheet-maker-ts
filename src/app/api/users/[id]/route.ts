import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
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

/**
 * 指定IDのユーザー情報を取得するAPI
 *
 * @description 指定されたIDのユーザーの詳細情報を関連データと共に取得します。
 * スキル、資格、MBTI情報、経歴情報も含めて返却します。
 *
 * @param {NextRequest} request - Next.jsのリクエストオブジェクト
 * @param {object} params - ルートパラメータ
 * @param {string} params.id - 取得したいユーザーのUUID
 *
 * @returns {Promise<NextResponse>} ユーザー情報を含むJSON レスポンス
 * @returns {boolean} returns.success - 処理の成功可否
 * @returns {User} returns.data - ユーザー情報
 *
 * @throws {404} 指定IDのユーザーが存在しない場合
 * @throws {500} サーバー内部エラーの場合
 *
 * @example
 * ```
 * GET /api/users/123e4567-e89b-12d3-a456-426614174000
 *
 * Response:
 * {
 *   "success": true,
 *   "data": { id: "123e4567-e89b-12d3-a456-426614174000", name: "田中太郎", ... }
 * }
 * ```
 */
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

/**
 * 指定IDのユーザー情報を更新するAPI
 *
 * @description 指定されたIDのユーザー情報を更新します。
 * ユーザー識別子とメールアドレスの重複チェックを実行します。
 *
 * @param {NextRequest} request - Next.jsのリクエストオブジェクト
 * @param {object} params - ルートパラメータ
 * @param {string} params.id - 更新したいユーザーのUUID
 * @param {object} [request.body] - 更新データ（部分更新可能）
 * @param {string} [request.body.userIdentifier] - ユーザー識別子
 * @param {string} [request.body.name] - 氏名
 * @param {string} [request.body.nameKana] - 氏名（カナ）
 * @param {string} [request.body.birthDate] - 生年月日
 * @param {string} [request.body.gender] - 性別
 * @param {string} [request.body.email] - メールアドレス
 * @param {string} [request.body.status] - ステータス
 *
 * @returns {Promise<NextResponse>} 更新されたユーザー情報を含むJSON レスポンス
 * @returns {boolean} returns.success - 処理の成功可否
 * @returns {User} returns.data - 更新されたユーザー情報
 *
 * @throws {400} バリデーションエラーの場合
 * @throws {404} 指定IDのユーザーが存在しない場合
 * @throws {409} ユーザー識別子またはメールアドレスが重複している場合
 * @throws {500} サーバー内部エラーの場合
 */
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

/**
 * 指定IDのユーザーを削除するAPI
 *
 * @description 指定されたIDのユーザーをシステムから完全に削除します。
 * 関連するスキル、資格、経歴情報も同時に削除されます。
 *
 * @param {NextRequest} request - Next.jsのリクエストオブジェクト
 * @param {object} params - ルートパラメータ
 * @param {string} params.id - 削除したいユーザーのUUID
 *
 * @returns {Promise<NextResponse>} 削除結果を含むJSON レスポンス
 * @returns {boolean} returns.success - 処理の成功可否
 * @returns {string} returns.message - 削除完了メッセージ
 *
 * @throws {404} 指定IDのユーザーが存在しない場合
 * @throws {500} サーバー内部エラーの場合
 */
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

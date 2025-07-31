import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// ユーザー作成・更新用のバリデーションスキーマ
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

/**
 * 全ユーザー情報を取得するAPI
 *
 * @description 登録されている全ユーザーの詳細情報を関連データと共に取得します。
 * スキル、資格、MBTI情報、経歴情報も含めて返却します。
 *
 * @returns {Promise<NextResponse>} ユーザー一覧を含むJSON レスポンス
 * @returns {boolean} returns.success - 処理の成功可否
 * @returns {User[]} returns.data - ユーザー情報の配列
 *
 * @example
 * ```
 * GET /api/users
 *
 * Response:
 * {
 *   "success": true,
 *   "data": [{ id: "...", name: "...", ... }]
 * }
 * ```
 */
export async function GET() {
  try {
    // 全ユーザー情報を関連データと共に取得
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

/**
 * ユーザー新規登録API
 *
 * @description 新しいユーザーを登録します。
 * ユーザー識別子とメールアドレスの重複チェックを実行し、重複がある場合は409エラーを返します。
 *
 * @param {NextRequest} request - Next.jsのリクエストオブジェクト
 * @param {object} request.body - リクエストボディ
 * @param {string} request.body.userIdentifier - ユーザー識別子（必須）
 * @param {string} request.body.name - 氏名（必須）
 * @param {string} request.body.nameKana - 氏名（カナ）（必須）
 * @param {string} request.body.birthDate - 生年月日（ISO日付形式）
 * @param {string} request.body.gender - 性別（male/female/other）
 * @param {string} request.body.email - メールアドレス（必須）
 * @param {string} [request.body.mbtiType] - MBTIタイプ（任意）
 * @param {string} [request.body.mbtiIdentity] - MBTI区分（任意）
 * @param {string} [request.body.joinedAt] - 入社日（任意）
 * @param {string} [request.body.retiredAt] - 退社日（任意）
 * @param {string} [request.body.finalEducation] - 最終学歴（任意）
 * @param {string} request.body.status - ステータス（inProject/available/onLeave/retired）
 * @param {string} [request.body.affiliation] - 所属（任意）
 * @param {string} [request.body.avatarPath] - アバター画像パス（任意）
 * @param {string} [request.body.githubUrl] - GitHub URL（任意）
 * @param {string} [request.body.prText] - PR文章（任意）
 * @param {string} [request.body.specialty] - 専門分野（任意）
 * @param {string} [request.body.techStrength] - 技術的強み（任意）
 * @param {string} [request.body.salesComment] - 営業コメント（任意）
 * @param {number} [request.body.toeicScore] - TOEICスコア（0-990、任意）
 * @param {string} [request.body.otherSkills] - その他スキル（任意）
 *
 * @returns {Promise<NextResponse>} 登録されたユーザー情報を含むJSON レスポンス
 * @returns {boolean} returns.success - 処理の成功可否
 * @returns {User} returns.data - 登録されたユーザー情報
 *
 * @throws {400} バリデーションエラーの場合
 * @throws {409} ユーザー識別子またはメールアドレスが重複している場合
 * @throws {500} サーバー内部エラーの場合
 *
 * @example
 * ```
 * POST /api/users
 * Content-Type: application/json
 *
 * {
 *   "userIdentifier": "user001",
 *   "name": "田中太郎",
 *   "nameKana": "タナカタロウ",
 *   "birthDate": "1990-01-01",
 *   "gender": "male",
 *   "email": "tanaka@example.com",
 *   "status": "available"
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "data": { id: "...", name: "田中太郎", ... }
 * }
 * ```
 */
export async function POST(request: NextRequest) {
  try {
    // リクエストボディを取得してバリデーション実行
    const body = await request.json();
    const validatedData = createUserSchema.parse(body);

    // ユーザー識別子とメールアドレスの重複チェック
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
          details: error.issues,
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

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

/**
 * 全資格情報を取得するAPI
 *
 * @description 登録されている全資格の情報を取得します。
 * 各資格を保有しているユーザー情報も含めて返却します。
 *
 * @returns {Promise<NextResponse>} 資格一覧を含むJSON レスポンス
 * @returns {boolean} returns.success - 処理の成功可否
 * @returns {Qualification[]} returns.data - 資格情報の配列（保有者情報含む）
 *
 * @throws {500} サーバー内部エラーの場合
 *
 * @example
 * ```
 * GET /api/qualifications
 *
 * Response:
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": "aws_saa",
 *       "label": "AWS Certified Solutions Architect - Associate",
 *       "description": "Amazon Web Servicesのソリューションアーキテクト資格",
 *       "userQualifications": [{ "userId": "...", "acquiredAt": "2023-01-01" }]
 *     }
 *   ]
 * }
 * ```
 */
export async function GET() {
  try {
    const qualifications = await prisma.qualification.findMany({
      include: {
        userQualifications: {
          select: {
            userId: true,
            acquiredAt: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: [
        { isNational: 'desc' }, // National qualifications first
        { name: 'asc' },
      ],
    });

    return NextResponse.json({
      success: true,
      data: qualifications,
    });
  } catch (error) {
    console.error('Error fetching qualifications:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch qualifications',
      },
      { status: 500 }
    );
  }
}

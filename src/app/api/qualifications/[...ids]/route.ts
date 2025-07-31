import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 指定された資格ID群の詳細情報を取得するAPI
 *
 * @description 指定された資格IDリストに対応する資格情報を取得します。
 * 単一IDと複数ID（カンマ区切り）の両方に対応し、各資格を保有しているユーザー情報も含まれます。
 * 資格は国家資格を優先し、名前順でソートされて返却されます。
 *
 * @param {NextRequest} request - Next.jsのリクエストオブジェクト
 * @param {object} params - ルートパラメータ
 * @param {string[]} params.ids - 取得対象の資格ID配列（単一またはカンマ区切り）
 *
 * @returns {Promise<NextResponse>} 処理結果を含むNextResponse
 * @returns {boolean} returns.success - 処理の成功可否
 * @returns {Qualification|Qualification[]} returns.data - 資格データ（単一時はオブジェクト、複数時は配列）
 * @returns {string} returns.data.id - 資格ID
 * @returns {string} returns.data.name - 資格名
 * @returns {string} returns.data.description - 資格説明
 * @returns {boolean} returns.data.isNational - 国家資格かどうか
 * @returns {UserQualification[]} returns.data.userQualifications - この資格を保有するユーザー一覧
 * @returns {string} returns.error - エラーメッセージ（失敗時のみ）
 * @returns {string[]} returns.notFoundIds - 見つからなかったIDの配列（該当時のみ）
 *
 * @throws {404} 指定された資格IDの一部または全部が見つからない場合
 * @throws {500} データベースアクセスエラーやその他の内部エラーが発生した場合
 *
 * @example
 * ```
 * GET /api/qualifications/fe,ap
 * Response: {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": "fe",
 *       "name": "基本情報技術者試験",
 *       "description": "ITの基本知識を評価する国家資格",
 *       "isNational": true,
 *       "userQualifications": [
 *         {
 *           "userId": "user-001",
 *           "acquiredAt": "2023-06-15T00:00:00.000Z",
 *           "user": { "id": "user-001", "name": "田中太郎" }
 *         }
 *       ]
 *     }
 *   ]
 * }
 * ```
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { ids: string[] } }
) {
  try {
    const idsParam = params.ids.join('/');
    const qualificationIds = idsParam.includes(',')
      ? idsParam.split(',').map((id) => id.trim())
      : [idsParam];

    const qualifications = await prisma.qualification.findMany({
      where: {
        id: {
          in: qualificationIds,
        },
      },
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
      orderBy: [{ isNational: 'desc' }, { name: 'asc' }],
    });

    const foundIds = qualifications.map((qualification) => qualification.id);
    const notFoundIds = qualificationIds.filter((id) => !foundIds.includes(id));

    if (notFoundIds.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Some qualifications not found',
          notFoundIds,
          data: qualifications,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: qualificationIds.length === 1 ? qualifications[0] : qualifications,
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

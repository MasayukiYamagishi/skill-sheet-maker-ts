import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Schema for bulk delete
const bulkDeleteSchema = z.object({
  ids: z.array(z.string().uuid()).min(1),
});

// DELETE /api/users/bulk - delete_user_by_ids (multiple users)
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids } = bulkDeleteSchema.parse(body);

    // Check if all users exist
    const existingUsers = await prisma.user.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: { id: true },
    });

    const existingIds = existingUsers.map((user) => user.id);
    const notFoundIds = ids.filter((id) => !existingIds.includes(id));

    if (notFoundIds.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Some users not found',
          notFoundIds,
        },
        { status: 404 }
      );
    }

    const result = await prisma.user.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `${result.count} users deleted successfully`,
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

    console.error('Error bulk deleting users:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete users',
      },
      { status: 500 }
    );
  }
}

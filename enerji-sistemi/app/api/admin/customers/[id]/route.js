import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Müşteri silinemedi:", error);
    return NextResponse.json({ error: "Müşteri silinirken bir hata oluştu." }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Mesaj ID'si eksik." }, { status: 400 });
    }

    // Sadece "read" (okundu) durumunu true yapıyoruz
    const updatedMessage = await prisma.message.update({
      where: { id },
      data: { read: true },
    });

    return NextResponse.json({ success: true, message: updatedMessage });
  } catch (error) {
    console.error("Mesaj okundu olarak işaretlenirken hata:", error);
    return NextResponse.json({ error: "İşlem başarısız." }, { status: 500 });
  }
}
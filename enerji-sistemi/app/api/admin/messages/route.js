import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // YENİ: prisma.message kullanarak doğru tabloyu çekiyoruz
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
    });
    
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Mesajlar getirilemedi:", error);
    return NextResponse.json({ error: "Mesajlar alınamadı." }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID gerekli" }, { status: 400 });

    // YENİ: prisma.message üzerinden siliyoruz
    await prisma.message.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mesaj silinemedi:", error);
    return NextResponse.json({ error: "Silme işlemi başarısız." }, { status: 500 });
  }
}
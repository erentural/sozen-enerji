import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(request, context) {
  try {
    // 1. ID'yi güvenli bir şekilde al (Next.js 15 uyumluluğu için await ekledik)
    const params = await context.params;
    let id = params?.id;

    // Yedek Plan: URL üzerinden ID'yi alma
    if (!id) {
      const url = new URL(request.url);
      id = url.searchParams.get("id") || url.pathname.split('/').pop();
    }

    // URL'de hiçbir şekilde ID yoksa direkt işlemi durdur
    if (!id) {
      return NextResponse.json({ error: "Silinecek müşterinin ID'si bulunamadı." }, { status: 400 });
    }

    // 2. Veritabanından Müşteriyi Bul
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        projects: true,
        appointments: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: "Müşteri bulunamadı." }, { status: 404 });
    }

    // 3. Akıllı Güvenlik Kontrolü
    if ((user.projects?.length > 0) || (user.appointments?.length > 0)) {
      return NextResponse.json({
        error: "Bu müşteriye ait aktif projeler veya randevular bulunmaktadır. Silmek için öncelikle müşterinin projelerini ve randevularını sistemden kaldırmalısınız."
      }, { status: 400 }); 
    }

    // 4. Hiçbir bağ yoksa güvenle sil
    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Müşteri silinirken backend hatası:", error);
    return NextResponse.json({ error: "Müşteri silinirken sistemsel bir hata oluştu." }, { status: 500 });
  }
}
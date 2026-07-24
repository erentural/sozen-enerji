import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // 1. Müşteriyi ve ona bağlı tüm ilişkili kayıtları (projeler ve randevular) bul
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

    // 2. Akıllı Güvenlik Kontrolü: Eğer müşteriye ait en az 1 proje veya randevu varsa silmeyi durdur
    if (user.projects.length > 0 || user.appointments.length > 0) {
      return NextResponse.json({
        error: "Bu müşteriye ait aktif projeler veya randevular bulunmaktadır. Silme işlemi yapabilmek için öncelikle müşterinin projelerini ve randevularını sistemden kaldırmalısınız."
      }, { status: 400 });
    }

    // 3. Hiçbir bağ yoksa güvenle sil
    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Müşteri silinirken hata:", error);
    return NextResponse.json({ error: "Müşteri silinirken sistemsel bir hata oluştu." }, { status: 500 });
  }
}
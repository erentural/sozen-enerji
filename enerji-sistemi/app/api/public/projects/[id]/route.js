import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request, context) {
  try {
    // 1. Next.js 15 uyumlu ID yakalama
    const resolvedParams = await context.params;
    const id = resolvedParams.id;

    if (!id) {
      return NextResponse.json({ error: "Hata: Proje ID'si alınamadı." }, { status: 400 });
    }

    // 2. ID Tipini Güvenceye Al (Sayıysa çevir, harf-rakam karışıksa dokunma)
    const projectId = isNaN(Number(id)) ? id : Number(id);

    // 3. Veritabanından projeyi bul
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    // 4. Proje yoksa 404 döndür
    if (!project) {
      return NextResponse.json({ error: "Proje bulunamadı." }, { status: 404 });
    }

    // 5. Proje varsa ön yüze (frontend'e) gönder
    return NextResponse.json(project);

  } catch (error) {
    console.error("Proje detay API Hatası:", error);
    return NextResponse.json({ error: "Veritabanı bağlantı hatası." }, { status: 500 });
  }
}
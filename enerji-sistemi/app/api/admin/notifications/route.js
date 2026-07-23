import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Okunmamış mesajları yeni "Message" tablosundan getir
    const messages = await prisma.message.findMany({
      where: { read: false },
      orderBy: { createdAt: 'desc' },
      take: 3
    }).catch(() => []); // Tablo yoksa veya hata verirse boş dizi dön

    // 2. Bekleyen randevuları getir (Tüm bekleyen statülerini kapsar)
    const appointments = await prisma.appointment.findMany({
      where: { status: { in: ['PENDING', 'Beklemede', 'bekliyor', 'YENI'] } },
      orderBy: { createdAt: 'desc' },
      take: 3
    }).catch(() => []);

    // 3. YENİ: Bekleyen Teklif Taleplerini getir
    const quotes = await prisma.quoteRequest.findMany({
      where: { status: 'YENI' },
      orderBy: { createdAt: 'desc' },
      take: 4
    }).catch(() => []);

    // Frontend tarafı artık doğrudan bu 3 diziyi bekliyor
    return NextResponse.json({
      messages,
      appointments,
      quotes
    });

  } catch (error) {
    console.error("Bildirimler alınırken hata:", error);
    // Hata durumunda uygulamanın çökmemesi için boş diziler döndürüyoruz
    return NextResponse.json({ messages: [], appointments: [], quotes: [] }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, service, bill, region, city, panelCount, roiYears } = body;

    // Gelen verileri veritabanına (QuoteRequest tablosuna) kaydet
    const newQuote = await prisma.quoteRequest.create({
      data: {
        name,
        phone,
        service, // Örn: Müstakil Ev - Çatı GES
        bill: Number(bill),
        region,
        city,
        panelCount: Number(panelCount),
        roiYears: String(roiYears),
        status: "YENI",
      },
    });

    return NextResponse.json({ success: true, quote: newQuote }, { status: 201 });
  } catch (error) {
    console.error("Teklif talebi oluşturulurken hata:", error);
    return NextResponse.json({ error: "Teklif talebi gönderilemedi." }, { status: 500 });
  }
}
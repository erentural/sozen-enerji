import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const { id, priceOffer } = await request.json();

    if (!id || !priceOffer) {
      return NextResponse.json({ error: "ID ve Fiyat zorunludur." }, { status: 400 });
    }

    // 1. Veritabanında teklifi güncelle ve durumunu KAPANDI/ONAYLANDI yap
    const updatedQuote = await prisma.quoteRequest.update({
      where: { id },
      data: {
        status: "KAPANDI",
        priceOffer: Number(priceOffer),
      },
    });

    // 2. MÜŞTERİYE MAİL GÖNDERME İŞLEMİ (Buraya Nodemailer veya Resend kodları gelecek)
    if (updatedQuote.email) {
      console.log(`MAİL GÖNDERİLİYOR -> Alıcı: ${updatedQuote.email}`);
      console.log(`Mesaj: Sayın ${updatedQuote.name}, ${updatedQuote.service} projeniz için belirlenen fiyat: ${priceOffer} TL'dir.`);
      // await sendEmail(updatedQuote.email, "Teklifiniz Hazır", "...");
    }

    return NextResponse.json({ success: true, quote: updatedQuote });
  } catch (error) {
    console.error("Teklif onaylanırken hata:", error);
    return NextResponse.json({ error: "İşlem başarısız." }, { status: 500 });
  }
}
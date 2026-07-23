import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const { id, priceOffer, messageToCustomer } = await request.json();

    if (!id || !priceOffer) {
      return NextResponse.json({ error: "Kayıt ID ve Fiyat bilgisi zorunludur." }, { status: 400 });
    }

    // 1. Veritabanında teklifi güncelle ve durumunu KAPANDI (Onaylandı) yap
    const updatedQuote = await prisma.quoteRequest.update({
      where: { id },
      data: {
        status: "KAPANDI",
        priceOffer: Number(priceOffer),
      },
    });

    // 2. MÜŞTERİYE MAİL GÖNDERME SİMÜLASYONU 
    // (Buraya ileride Resend veya Nodemailer entegrasyonu gelecek)
    if (updatedQuote.email) {
      console.log("=========================================");
      console.log(`MAİL GÖNDERİLDİ -> Alıcı: ${updatedQuote.email}`);
      console.log(`Konu: ${updatedQuote.service} Talebiniz İçin Fiyat Teklifimiz`);
      console.log(`Mesaj: \nSayın ${updatedQuote.name},\n\nTalebiniz incelenmiştir. Belirlenen Fiyat: ${priceOffer} TL'dir.\n\nUzman Notu: ${messageToCustomer}\n\nTeşekkür ederiz.`);
      console.log("=========================================");
    }

    return NextResponse.json({ success: true, quote: updatedQuote });
  } catch (error) {
    console.error("Teklif onaylanırken hata:", error);
    return NextResponse.json({ error: "İşlem başarısız oldu." }, { status: 500 });
  }
}
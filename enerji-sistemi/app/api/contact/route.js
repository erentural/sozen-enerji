import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Gerekli alanların doldurulduğundan emin olalım
    if (!name || !phone || !message) {
      return NextResponse.json({ error: "Lütfen zorunlu alanları doldurun." }, { status: 400 });
    }

    // Mesajı veritabanına kaydet
    const newMessage = await prisma.contactMessage.create({
      data: {
        name,
        email: email || "", // E-posta zorunlu değilse boş string atıyoruz
        phone,
        message,
        isRead: false, // Yeni geldiği için okunmamış olarak işaretliyoruz
      },
    });

    return NextResponse.json({ success: true, message: "Mesajınız başarıyla iletildi." }, { status: 201 });
  } catch (error) {
    console.error("Mesaj kaydedilirken hata oluştu:", error);
    return NextResponse.json({ error: "Bir hata oluştu, lütfen daha sonra tekrar deneyin." }, { status: 500 });
  }
}
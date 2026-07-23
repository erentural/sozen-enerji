import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Zorunlu alanların kontrolü
    if (!name || !email || !phone || !message) {
      return NextResponse.json({ error: "Lütfen tüm zorunlu alanları doldurun." }, { status: 400 });
    }

    // Veritabanına kayıt işlemi
    const newMessage = await prisma.message.create({
      data: {
        name,
        email,
        phone, // Artık telefon hatasız şekilde kaydediliyor
        subject: subject || "Genel Mesaj",
        message,
        read: false,
        replied: false,
      },
    });

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error) {
    console.error("Mesaj kaydedilirken hata:", error);
    return NextResponse.json({ error: "Mesaj kaydedilemedi." }, { status: 500 });
  }
}
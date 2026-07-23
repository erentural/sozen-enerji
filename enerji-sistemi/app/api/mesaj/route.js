import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Gelen öneri/şikayet verisini Message tablosuna kaydet
    const newMessage = await prisma.message.create({
      data: {
        name,
        email,
        subject,
        message,
        read: false,
      },
    });

    return NextResponse.json({ success: true, data: newMessage }, { status: 201 });
  } catch (error) {
    console.error("Mesaj kaydedilirken hata:", error);
    return NextResponse.json({ error: "Mesajınız gönderilemedi." }, { status: 500 });
  }
}
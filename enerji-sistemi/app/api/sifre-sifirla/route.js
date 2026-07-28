import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Geçersiz istek parametreleri." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Şifre en az 6 karakter olmalıdır." }, { status: 400 });
    }

    // 1. Veritabanında bu token'a sahip ve süresi henüz dolmamış kullanıcıyı bul
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(), // Süresi şu andan büyük (yani geçmemiş) olmalı
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Sıfırlama bağlantısının süresi dolmuş veya bağlantı geçersiz." }, { status: 400 });
    }

    // 2. Yeni şifreyi güvenli bir şekilde hash'le
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Kullanıcının şifresini güncelle ve kullanıldığı için token alanlarını temizle
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({ success: true, message: "Şifreniz başarıyla güncellendi." }, { status: 200 });

  } catch (error) {
    console.error("Şifre sıfırlama hatası:", error);
    return NextResponse.json({ error: "Sistemsel bir hata oluştu." }, { status: 500 });
  }
}
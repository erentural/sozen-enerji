import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const body = await request.json();
    const { firstName, lastName, phone, email, password } = body;

    // E-posta daha önce kayıtlı mı kontrolü
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: "Bu e-posta adresi zaten kullanılıyor." }, { status: 400 });
    }

    // Şifreyi güvenli hale getir (Hash)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Ad ve soyadı birleştirerek kaydet
    const fullName = `${firstName} ${lastName}`;

    // Veritabanına yeni müşteriyi ekle
    const newUser = await prisma.user.create({
      data: {
        name: fullName,
        email,
        phone,
        password: hashedPassword,
        role: "CUSTOMER", // Varsayılan müşteri rolü
      }
    });

    return NextResponse.json({ message: "Kayıt başarıyla oluşturuldu." }, { status: 201 });

  } catch (error) {
    console.error("Kayıt Hatası:", error);
    return NextResponse.json({ error: "Kayıt işlemi sırasında bir hata oluştu." }, { status: 500 });
  }
}
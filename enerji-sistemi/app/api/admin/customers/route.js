import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

// Tüm kullanıcıları/müşterileri veritabanından çek
export async function GET() {
  try {
    const customers = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        projects: true, 
      },
    });
    return NextResponse.json(customers);
  } catch (error) {
    console.error("Müşteriler getirilemedi:", error);
    return NextResponse.json({ error: "Müşteriler alınamadı." }, { status: 500 });
  }
}

// Yeni müşteri veya yönetici ekle
export async function POST(request) {
  try {
    const body = await request.json();
    // YENİ EKLENEN: role değişkeni formdan alınıyor
    const { name, email, password, role } = body;

    // E-posta benzersizlik kontrolü
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Bu e-posta adresine sahip bir kullanıcı zaten kayıtlı." },
        { status: 400 }
      );
    }

    // Şifreyi güvenli formata (hash) çevir (girilmezse varsayılan "musteri123")
    const plainPassword = password || "musteri123";
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "USER", // YENİ: Forma göre "ADMIN" veya "USER" kaydedilir
      },
      include: { projects: true },
    });

    return NextResponse.json({ success: true, customer: newUser }, { status: 201 });
  } catch (error) {
    console.error("Kullanıcı eklenirken hata:", error);
    return NextResponse.json({ error: "Kullanıcı eklenemedi." }, { status: 500 });
  }
}
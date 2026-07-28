import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

// GET: Sadece personelleri (Yetkisi USER olmayanları) listele
export async function GET() {
  try {
    const staff = await prisma.user.findMany({
      where: {
        role: { not: "USER" } // Normal müşterileri hariç tut
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(staff);
  } catch (error) {
    return NextResponse.json({ error: "Personel listesi alınamadı." }, { status: 500 });
  }
}

// POST: Yeni personel ekle
export async function POST(request) {
  try {
    const { name, email, password, role } = await request.json();
    
    // E-posta kontrolü
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Bu e-posta adresi zaten kullanımda." }, { status: 400 });
    }

    // Şifreyi güvenli hale getir
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newStaff = await prisma.user.create({
      data: { name, email, password: hashedPassword, role }
    });

    return NextResponse.json({ success: true, user: newStaff }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Personel eklenemedi." }, { status: 500 });
  }
}

// DELETE: Personel sil (Yetkisini al)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID belirtilmedi." }, { status: 400 });

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Personel başarıyla silindi." });
  } catch (error) {
    return NextResponse.json({ error: "Personel silinemedi." }, { status: 500 });
  }
}
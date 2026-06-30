import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET: Tüm projeleri ve ait oldukları müşterileri getirir
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: { 
        customer: true // İlişkili olduğu müşteri bilgilerini de çekiyoruz
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Projeler getirilemedi." }, { status: 500 });
  }
}

// POST: Yeni proje oluşturur (Müşteri yoksa onu da oluşturur)
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, progress, customerName, customerEmail } = body;

    // 1. Bu e-postaya sahip bir müşteri var mı kontrol et
    let customer = await prisma.user.findUnique({
      where: { email: customerEmail },
    });

    // 2. Yoksa, ona otomatik bir hesap oluştur
    if (!customer) {
      // Müşterinin sonradan girebilmesi için varsayılan bir şifre belirliyoruz
      const hashedPassword = await bcrypt.hash("Musteri123!", 10);
      customer = await prisma.user.create({
        data: {
          name: customerName,
          email: customerEmail,
          password: hashedPassword,
          role: "USER",
        },
      });
    }

    // 3. Projeyi oluştur ve müşteriye (customerId ile) bağla
    const project = await prisma.project.create({
      data: {
        title,
        description,
        location,
        progress: parseInt(progress) || 0,
        customerId: customer.id,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Proje eklenirken hata oluştu." }, { status: 500 });
  }
}
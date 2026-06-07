import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Projeleri Listeleme
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        customer: true // <--- DÜZELTME: user yerine customer yapıldı
      }
    });
    
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Projeler getirilemedi:", error);
    return NextResponse.json({ error: "Projeler alınamadı." }, { status: 500 });
  }
}

// Yeni Proje Ekleme
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, progress, customerEmail } = body;

    const user = await prisma.user.findUnique({ 
      where: { email: customerEmail } 
    });

    if (!user) {
       return NextResponse.json({ error: "Bu e-posta adresiyle kayıtlı müşteri bulunamadı." }, { status: 404 });
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        progress: parseInt(progress),
        customerId: user.id // <--- DÜZELTME: userId yerine customerId yapıldı
      }
    });

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error) {
    console.error("Proje eklenirken hata:", error);
    return NextResponse.json({ error: "Proje eklenemedi." }, { status: 500 });
  }
}
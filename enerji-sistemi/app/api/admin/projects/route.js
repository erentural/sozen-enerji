import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Projeleri Listeleme
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        customer: true // user yerine customer ilişkisi
      }
    });
    
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Projeler getirilemedi:", error);
    return NextResponse.json({ error: "Projeler alınamadı." }, { status: 500 });
  }
}

// Yeni Proje Ekleme (Güvenlik Kontrollü ve Görsel Destekli)
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Formdan gelen verileri yakalıyoruz (imageUrl eklendi)
    const { title, description, location, progress, customerEmail, customerName, imageUrl } = body;
    
    // 1. Adım: Girilen e-postaya sahip bir müşteri var mı diye veritabanını kontrol et
    const user = await prisma.user.findUnique({ 
      where: { email: customerEmail } 
    });

    // 2. Adım: Eğer müşteri YOKSA işlemi anında durdur ve Frontend'e 404 hatası gönder
    if (!user) {
      return NextResponse.json(
        { error: "Kayıtlı müşteri bulunamadı. Lütfen iş oluşturmadan önce müşterinin sisteme kayıt olduğundan emin olun." },
        { status: 404 }
      );
    }

    // 3. Adım: Müşteri sistemde kayıtlıysa, projeyi oluştur (Görsel dahil)
    const project = await prisma.project.create({
      data: {
        title,
        description,
        location,
        progress: parseInt(progress),
        imageUrl, // Base64 formatındaki görsel veritabanına yazılıyor
        customerId: user.id 
      }
    });

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error) {
    console.error("Proje eklenirken hata:", error);
    return NextResponse.json({ error: "Proje eklenemedi." }, { status: 500 });
  }
}
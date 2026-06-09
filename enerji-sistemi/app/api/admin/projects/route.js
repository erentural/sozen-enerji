import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

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

// Yeni Proje Ekleme (Otomatik Müşteri Kaydı ile)
export async function POST(request) {
  try {
    const body = await request.json();
    // Formdan gelen verileri yakalıyoruz (İsim bilgisi geliyorsa onu da alıyoruz)
    const { title, description, progress, customerEmail, customerName } = body;

    // 1. Adım: Önce bu e-postaya sahip bir müşteri var mı diye veritabanına bak
    let user = await prisma.user.findUnique({ 
      where: { email: customerEmail } 
    });

    // 2. Adım: Eğer müşteri YOKSA, arka planda yeni müşteriyi yarat
    if (!user) {
      // Önce şifreyi NextAuth'un onaylayacağı şifreli formata (hash) çeviriyoruz
      const hashedPassword = await bcrypt.hash("musteri123", 10);

      user = await prisma.user.create({
        data: {
          email: customerEmail,
          name: customerName || "Yeni Müşteri",
          password: hashedPassword, // Düz metin yerine şifrelenmiş halini kaydediyoruz
        }
      });
    }

    // 3. Adım: Artık elimizde (eski veya yeni fark etmeksizin) kesinlikle bir müşteri ID'si var. Projeyi rahatça oluştur!
    const project = await prisma.project.create({
      data: {
        title,
        description,
        progress: parseInt(progress),
        customerId: user.id 
      }
    });

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error) {
    console.error("Proje eklenirken hata:", error);
    return NextResponse.json({ error: "Proje eklenemedi." }, { status: 500 });
  }
}
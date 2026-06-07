import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Giriş yapan kullanıcının oturum bilgisini al
    const session = await getServerSession(authOptions);

    // Oturum yoksa yetkisiz erişim hatası döndür
    if (!session || !session.user) {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
    }

    const customerId = session.user.id;

    // 2. Sadece bu müşteriye ait projeleri getir
    const projects = await prisma.project.findMany({
      where: { customerId: customerId },
      orderBy: { createdAt: "desc" },
    });

    // 3. Sadece bu müşteriye ait randevuları getir
    const appointments = await prisma.appointment.findMany({
      where: { customerId: customerId },
      orderBy: { date: "desc" },
    });

    // 4. Verileri tek bir objede birleştirip gönder
    return NextResponse.json({ projects, appointments });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Veriler getirilirken bir hata oluştu." }, { status: 500 });
  }
}
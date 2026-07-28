import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Tüm randevuları getirir
export async function GET() {
  try {
    // Tüm randevuları tarihe göre sıralayarak getir
    // include: { customer: true } diyerek randevuyu kimin aldığı bilgisini de çekiyoruz
    const appointments = await prisma.appointment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        customer: true 
      }
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Randevular getirilemedi:", error);
    return NextResponse.json({ error: "Randevular alınamadı." }, { status: 500 });
  }
}

// PATCH: Randevu durumunu (Onayla, Reddet, Tamamla) günceller
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Randevu ID ve Status zorunludur." }, { status: 400 });
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: { status }, // "PENDING", "APPROVED", "REJECTED", "COMPLETED"
    });

    return NextResponse.json(updatedAppointment, { status: 200 });
  } catch (error) {
    console.error("Randevu güncellenirken hata:", error);
    return NextResponse.json({ error: "Randevu güncellenemedi." }, { status: 500 });
  }
}

// DELETE: Randevuyu tamamen siler
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Silinecek randevu ID'si belirtilmedi." }, { status: 400 });
    }

    await prisma.appointment.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Randevu başarıyla silindi." }, { status: 200 });
  } catch (error) {
    console.error("Randevu silinirken hata:", error);
    return NextResponse.json({ error: "Randevu silinemedi." }, { status: 500 });
  }
}
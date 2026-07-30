import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: "Durum (status) verisi eksik." }, { status: 400 });
    }

    // Güncellenecek veri objesini hazırla
    const updateData = { status };

    // Eğer randevu tamamlandı olarak işaretlenirse, tamamlanma tarihini de ekle
    if (status === 'COMPLETED') {
      updateData.completedAt = new Date();
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: String(id) },
      data: updateData
    });

    return NextResponse.json({ success: true, appointment: updatedAppointment });

  } catch (error) {
    console.error("Randevu Güncelleme Hatası:", error);
    return NextResponse.json({ error: "Randevu güncellenemedi." }, { status: 500 });
  }
}
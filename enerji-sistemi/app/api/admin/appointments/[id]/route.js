import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request, { params }) {
  try {
    // Dinamik id'yi await ile alıyoruz (Daha önce öğrendiğimiz gibi!)
    const { id } = await params;
    
    // Gelen verinin içinden yeni durumu (status) alıyoruz
    const body = await request.json();
    const { status } = body;

    // Veritabanını güncelle
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, appointment: updatedAppointment });
  } catch (error) {
    console.error("Randevu güncellenirken hata:", error);
    return NextResponse.json({ error: "Randevu güncellenemedi." }, { status: 500 });
  }
}
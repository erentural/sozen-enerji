import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body; // PENDING, APPROVED, REJECTED, COMPLETED

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    return NextResponse.json({ error: "Randevu güncellenirken hata oluştu." }, { status: 500 });
  }
}
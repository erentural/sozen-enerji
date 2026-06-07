import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Okundu olarak işaretleme (PATCH)
export async function PATCH(request, { params }) {
  try {
    // BURASI ÖNEMLİ: params'ın önüne await ekledik
    const { id } = await params; 
    
    await prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Güncelleme hatası:", error);
    return NextResponse.json({ error: "Mesaj güncellenemedi" }, { status: 500 });
  }
}

// Mesajı Silme (DELETE)
export async function DELETE(request, { params }) {
  try {
    // BURASI ÖNEMLİ: params'ın önüne await ekledik
    const { id } = await params; 
    
    await prisma.contactMessage.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Silme hatası:", error);
    return NextResponse.json({ error: "Mesaj silinemedi" }, { status: 500 });
  }
}
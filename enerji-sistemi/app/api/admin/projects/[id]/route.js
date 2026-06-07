import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Projeyi Güncelle (PATCH)
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Gelen verileri al (Senin formundaki alanlara göre)
    const { title, description, progress } = body;

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        progress: parseInt(progress), // Yüzdeyi sayıya çeviriyoruz
      },
    });

    return NextResponse.json({ success: true, project: updatedProject });
  } catch (error) {
    console.error("Proje güncellenemedi:", error);
    return NextResponse.json({ error: "Proje güncellenemedi." }, { status: 500 });
  }
}

// Projeyi Sil (DELETE)
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.project.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Proje silinemedi:", error);
    return NextResponse.json({ error: "Proje silinemedi." }, { status: 500 });
  }
}
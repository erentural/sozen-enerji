import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { progress } = body;

    if (progress === undefined) {
      return NextResponse.json({ error: "İlerleme (progress) değeri eksik." }, { status: 400 });
    }

    const updatedProject = await prisma.project.update({
      where: { id: String(id) }, 
      data: { progress: parseInt(progress) }
    });

    return NextResponse.json({ success: true, project: updatedProject });

  } catch (error) {
    console.error("Proje Güncelleme Hatası:", error);
    return NextResponse.json({ error: "Proje güncellenemedi." }, { status: 500 });
  }
}
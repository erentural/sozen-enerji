import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: "Mesajlar alınamadı." }, { status: 500 });
  }
}
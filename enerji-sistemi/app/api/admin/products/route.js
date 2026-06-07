import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Ürünleri Listeleme (GET)
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Ürünler getirilemedi:", error);
    return NextResponse.json({ error: "Ürünler alınamadı." }, { status: 500 });
  }
}

// Yeni Ürün Ekleme (POST)
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, price, imageUrl } = body;

    const product = await prisma.product.create({
      data: {
        name: title, // <--- DÜZELTME BURADA: title verisini name sütununa yazdırıyoruz
        description,
        price: parseFloat(price),
        imageUrl: imageUrl || null,
      }
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error("Ürün eklenirken hata:", error);
    return NextResponse.json({ error: "Ürün eklenemedi." }, { status: 500 });
  }
}
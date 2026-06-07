import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Tüm ürünleri veritabanından çekip getirir
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" }, // En son eklenen en üstte çıksın
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Ürünler getirilemedi." }, { status: 500 });
  }
}

// POST: Arayüzden gelen verilerle yeni ürün oluşturur
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, price, imageUrl } = body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: price ? parseFloat(price) : null,
        imageUrl: imageUrl || null,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Ürün eklenirken bir hata oluştu." }, { status: 500 });
  }
}
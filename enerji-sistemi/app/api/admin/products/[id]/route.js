import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, price, imageUrl } = body;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: title, // <--- DÜZELTME BURADA: title verisini name sütununa yazdırıyoruz
        description,
        price: parseFloat(price),
        imageUrl: imageUrl || null,
      },
    });

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error("Ürün güncellenemedi:", error);
    return NextResponse.json({ error: "Ürün güncellenemedi." }, { status: 500 });
  }
}

// Ürünü Sil (DELETE)
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.product.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ürün silinemedi:", error);
    return NextResponse.json({ error: "Ürün silinemedi." }, { status: 500 });
  }
}
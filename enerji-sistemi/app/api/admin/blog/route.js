import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// Tüm blog yazılarını getir
export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Blog çekme hatası:", error);
    return NextResponse.json({ error: "Yazılar alınırken hata oluştu." }, { status: 500 });
  }
}

// Yeni blog yazısı ekle
export async function POST(req) {
  try {
    const body = await req.json();
    const { title, summary, content, imageUrl, published } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Başlık ve içerik zorunludur." }, { status: 400 });
    }

    // Başlıktan otomatik URL dostu (SEO) slug oluşturma
    let slug = title
      .toLowerCase()
      .trim()
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
      
    // Aynı isimde başlık olma ihtimaline karşı sonuna benzersiz bir ID ekliyoruz
    slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPost = await prisma.blogPost.create({
      data: {
        title,
        slug,
        summary: summary || "",
        content,
        imageUrl: imageUrl || null,
        published: published !== undefined ? published : true,
      }
    });

    return NextResponse.json({ success: true, post: newPost });
  } catch (error) {
    console.error("Blog ekleme hatası:", error);
    return NextResponse.json({ error: "Yazı eklenirken hata oluştu." }, { status: 500 });
  }
}
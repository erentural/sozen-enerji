import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  try {
    let data = [];
    let csvString = "";

    // Müşterileri İndir
    if (type === "customers") {
      data = await prisma.user.findMany({ where: { role: "USER" } });
      csvString = "ID,Ad Soyad,E-Posta,Telefon,Kayit Tarihi\n" + 
        data.map(u => `${u.id},${u.name},${u.email},${u.phone || "-"},${new Date(u.createdAt).toLocaleDateString("tr-TR")}`).join("\n");
    } 
    
    // Randevuları İndir
    else if (type === "appointments") {
      data = await prisma.appointment.findMany({ include: { customer: true } });
      csvString = "ID,Konu,Tarih,Durum,Musteri Adi,Musteri E-Posta\n" + 
        data.map(a => `${a.id},${a.subject},${new Date(a.date).toLocaleString("tr-TR")},${a.status},${a.customer?.name || "-"},${a.customer?.email || "-"}`).join("\n");
    } 
    
    // Projeleri İndir
    else if (type === "projects") {
      data = await prisma.project.findMany({ include: { customer: true } });
      csvString = "ID,Proje Adi,Konum,Ilerleme,Musteri Adi,Kayit Tarihi\n" + 
        data.map(p => `${p.id},${p.title},${p.location || "-"},%${p.progress},${p.customer?.name || "-"},${new Date(p.createdAt).toLocaleDateString("tr-TR")}`).join("\n");
    } 
    
    // Hatalı İstek
    else {
      return NextResponse.json({ error: "Geçersiz veri tipi." }, { status: 400 });
    }

    // CSV formatında dosyayı indirmeye zorlayan Header ayarları
    return new NextResponse(csvString, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${type}_yedek_${new Date().toLocaleDateString("tr-TR")}.csv"`,
      },
    });

  } catch (error) {
    console.error("Dışa aktarma hatası:", error);
    return NextResponse.json({ error: "Veri dışa aktarılamadı." }, { status: 500 });
  }
}
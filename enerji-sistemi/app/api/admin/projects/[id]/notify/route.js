import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    
    // Projeyi ve müşteriyi bul
    const project = await prisma.project.findUnique({
      where: { id },
      include: { customer: true }
    });

    if (!project || !project.customer) {
      return NextResponse.json({ error: "Müşteri bilgisi bulunamadı." }, { status: 404 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "eren.tural61@gmail.com",
        pass: "pefj fcan lbpm doap",
      },
    });

    // 1. DÜZELTME: Gönderen adı Sözen Enerji yapıldı
    const mailOptions = {
      from: '"Sözen Enerji" <eren.tural61@gmail.com>',
      to: project.customer.email, 
      subject: `Proje Durum Güncellemesi: ${project.title}`,
      
      // 2. DÜZELTME: HTML tasarımı Sözen Enerji logolu hale getirildi
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e5e7eb; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); background-color: #ffffff;">
          
          <div style="text-align: center; border-bottom: 3px solid #f8fafc; padding-bottom: 20px; margin-bottom: 25px;">
            <div style="display: inline-flex; align-items: center; justify-content: center;">
              <h2 style="margin: 0; font-size: 32px; font-weight: 900; letter-spacing: -1px;">
                <span style="color: #02529C;">SÖZEN</span><span style="color: #FFC107;">ENERJİ</span>
              </h2>
            </div>
            <p style="margin: 6px 0 0 0; font-size: 11px; font-weight: bold; color: #6b7280; letter-spacing: 3px; text-transform: uppercase;">
              Elektrik & İnşaat
            </p>
          </div>
          
          <p style="color: #374151; font-size: 16px;">Sayın <strong>${project.customer.name}</strong>,</p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;"><strong>${project.title}</strong> projenizle ilgili güncel durumu sizinle paylaşmak istedik.</p>
          
          <div style="background-color: #f8fafc; padding: 25px; border-radius: 10px; margin: 30px 0; border-left: 5px solid #02529C;">
            <p style="margin: 0 0 12px 0; font-size: 15px; color: #4b5563;">
              <strong>Güncel İlerleme:</strong> 
              <span style="color: #02529C; font-size: 22px; font-weight: 900; margin-left: 8px;">%${project.progress}</span>
            </p>
            <p style="margin: 0; font-size: 15px; color: #4b5563; line-height: 1.6;">
              <strong>Son Durum / Açıklama:</strong> <br/>
              <span style="color: #1f2937;">${project.description}</span>
            </p>
          </div>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">Operasyonlarımız planlandığı şekilde, Sözen Enerji güvencesiyle devam etmektedir. Sürecin her aşamasında sizi bilgilendirmeye devam edeceğiz.</p>
          
          <div style="margin-top: 45px; padding-top: 25px; border-top: 1px solid #e5e7eb; text-align: center;">
            <p style="color: #02529C; font-size: 14px; font-weight: bold; margin: 0 0 8px 0;">Sözen Enerji Elektrik & İnşaat</p>
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayınız.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Mail başarıyla gönderildi." });
  } catch (error) {
    console.error("Mail gönderme hatası:", error);
    return NextResponse.json({ error: "Mail gönderilemedi." }, { status: 500 });
  }
}
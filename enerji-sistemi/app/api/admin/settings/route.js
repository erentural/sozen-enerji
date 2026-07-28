import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let settings = await prisma.systemSettings.findUnique({
      where: { id: "global" }
    });

    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: { id: "global" }
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Ayarlar getirilemedi:", error);
    return NextResponse.json({ error: "Ayarlar alınamadı." }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { companyForm, smtpForm, scheduleForm, pdfForm } = body; // pdfForm eklendi

    const updatedSettings = await prisma.systemSettings.update({
      where: { id: "global" },
      data: {
        ...(companyForm && {
          companyName: companyForm.companyName,
          supportEmail: companyForm.supportEmail,
          phone: companyForm.phone,
          address: companyForm.address,
        }),
        ...(smtpForm && {
          smtpHost: smtpForm.smtpHost,
          smtpPort: parseInt(smtpForm.smtpPort),
          smtpUser: smtpForm.smtpUser,
          smtpPass: smtpForm.smtpPass,
        }),
        ...(scheduleForm && {
          workHourStart: scheduleForm.workHourStart,
          workHourEnd: scheduleForm.workHourEnd,
          allowWeekend: scheduleForm.allowWeekend,
        }),
        ...(pdfForm && {
          taxNumber: pdfForm.taxNumber,
          mersisNumber: pdfForm.mersisNumber,
          pdfFooterText: pdfForm.pdfFooterText,
          logoUrl: pdfForm.logoUrl,
        })
      }
    });

    return NextResponse.json(updatedSettings, { status: 200 });
  } catch (error) {
    console.error("Ayarlar güncellenirken hata:", error);
    return NextResponse.json({ error: "Ayarlar güncellenemedi." }, { status: 500 });
  }
}
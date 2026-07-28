import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// SAYFA YÜKLENDİĞİNDE MEVCUT AYARLARI OKU (GET)
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    // Kullanıcı bilgilerini al
    const user = await prisma.user.findUnique({ 
      where: { id: session.user.id },
      select: { name: true, email: true }
    });

    // Veritabanından sistem ayarlarını al (Eğer yoksa null döner)
    const settings = await prisma.settings.findUnique({
      where: { id: 1 }
    });

    return NextResponse.json({
      profile: { 
        name: user?.name || "", 
        email: user?.email || "" 
      },
      company: { 
        companyName: settings?.companyName || "", 
        supportEmail: settings?.supportEmail || "", 
        phone: settings?.phone || "", 
        address: settings?.address || "" 
      },
      notifications: {
        emailOnAppointment: settings?.emailOnAppointment ?? true,
        emailOnMessage: settings?.emailOnMessage ?? true,
        emailOnQuote: settings?.emailOnQuote ?? true,
        smsAlerts: settings?.smsAlerts ?? false
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Ayarlar çekilirken hata:", error);
    return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 });
  }
}

// KAYDET BUTONUNA BASILDIĞINDA AYARLARI GÜNCELLE (PUT)
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    
    const { profileForm, companyForm, notificationForm } = body;

    // 1. PROFİL VE ŞİFRE GÜNCELLEMESİ
    if (profileForm) {
      const { name, currentPassword, newPassword } = profileForm;
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (currentPassword && newPassword) {
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
          return NextResponse.json({ error: "Mevcut şifreniz hatalı." }, { status: 400 });
        }
        
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
          where: { id: userId },
          data: { name: name || user.name, password: hashedPassword },
        });
      } 
      else if (name && name !== user.name) {
        await prisma.user.update({
          where: { id: userId },
          data: { name },
        });
      }
    }

    // 2. KURUMSAL BİLGİLER VE BİLDİRİM TERCİHLERİ GÜNCELLEMESİ
    if (companyForm || notificationForm) {
      await prisma.settings.upsert({
        where: { id: 1 }, 
        update: {
          companyName: companyForm?.companyName,
          supportEmail: companyForm?.supportEmail,
          phone: companyForm?.phone,
          address: companyForm?.address,
          emailOnAppointment: notificationForm?.emailOnAppointment,
          emailOnMessage: notificationForm?.emailOnMessage,
          emailOnQuote: notificationForm?.emailOnQuote,
          smsAlerts: notificationForm?.smsAlerts,
        },
        create: {
          id: 1,
          companyName: companyForm?.companyName || "",
          supportEmail: companyForm?.supportEmail || "",
          phone: companyForm?.phone || "",
          address: companyForm?.address || "",
          emailOnAppointment: notificationForm?.emailOnAppointment ?? true,
          emailOnMessage: notificationForm?.emailOnMessage ?? true,
          emailOnQuote: notificationForm?.emailOnQuote ?? true,
          smsAlerts: notificationForm?.smsAlerts ?? false,
        }
      });
    }

    return NextResponse.json({ message: "Ayarlar başarıyla güncellendi." }, { status: 200 });

  } catch (error) {
    console.error("Ayarlar güncellenirken hata:", error);
    return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Oturum kontrolü
    if (!session || !session.user) {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { name, currentPassword, newPassword } = body;

    // Sadece isim güncelleniyorsa
    if (name && !currentPassword && !newPassword) {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { name },
      });
      return NextResponse.json({ message: "Profil güncellendi.", user: updatedUser });
    }

    // Şifre de güncellenmek isteniyorsa
    if (currentPassword && newPassword) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      
      // Mevcut şifreyi doğrula
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return NextResponse.json({ error: "Mevcut şifreniz hatalı." }, { status: 400 });
      }

      // Yeni şifreyi hashle ve kaydet
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: userId },
        data: { 
          name: name || user.name,
          password: hashedPassword 
        },
      });

      return NextResponse.json({ message: "Profil ve şifre başarıyla güncellendi." });
    }

    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });

  } catch (error) {
    console.error("Ayarlar güncellenirken hata:", error);
    return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 });
  }
}
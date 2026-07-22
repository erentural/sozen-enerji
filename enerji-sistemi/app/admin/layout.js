import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default async function AdminLayout({ children }) {
  // Sunucu tarafında kullanıcının oturumunu kontrol ediyoruz
  const session = await getServerSession(authOptions);

  // 1. DÜZELTME: Eğer hiç oturum yoksa, artık normal login'e değil, gizli ADMIN login sayfasına at
  if (!session) {
    redirect("/admin/login");
  }

  // 2. DÜZELTME: Eğer kişi giriş yapmış ama rolü ADMIN değilse (yani yanlışlıkla buraya giren bir müşteriyse), onu ana sayfaya postala
  if (session.user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sol Menü */}
      <Sidebar />

      {/* Sağ İçerik Alanı */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Üst Bilgi Barı (Header) */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 z-10">
          <h2 className="text-lg font-semibold text-gray-800">Yönetim Paneli</h2>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
              {session.user.name.charAt(0)}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {session.user.name}
            </span>
          </div>
        </header>

        {/* Değişen Sayfa İçerikleri Buraya Gelecek */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
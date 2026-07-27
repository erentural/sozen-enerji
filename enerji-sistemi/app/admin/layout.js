import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { ThemeProvider } from "./ThemeContext"; // YENİ: Global Temayı İçe Aktarıyoruz

export default async function AdminLayout({ children }) {
  // Sunucu tarafında kullanıcının oturumunu kontrol ediyoruz
  const session = await getServerSession(authOptions);

  // 1. DÜZELTME: Eğer hiç oturum yoksa, artık normal login'e değil, gizli ADMIN login sayfasına at
  if (!session) {
    redirect("/admin/login");
  }

  // Oturum yoksa veya kullanıcının rolü ADMIN değilse
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/admin-login"); // YENİ YOL BURASI OLDU
  }

  return (
    /* YENİ: Tüm iskeleti ThemeProvider ile sarmalıyoruz ki tema verisi her yere ulaşsın */
    <ThemeProvider>
      <div className="flex h-screen font-sans bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        
        {/* Sol Menü */}
        <Sidebar />

        {/* Sağ İçerik Alanı */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Üst Bilgi Barı (Header) - Karanlık Moda Uyarlandı */}
          <header className="h-16 bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-8 z-10 transition-colors duration-300">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white transition-colors">Yönetim Paneli</h2>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-slate-700 text-blue-600 dark:text-slate-300 rounded-full flex items-center justify-center font-bold transition-colors">
                {session.user.name.charAt(0)}
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">
                {session.user.name}
              </span>
            </div>
          </header>

          {/* Değişen Sayfa İçerikleri Buraya Gelecek */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
            {children}
          </main>
          
        </div>
      </div>
    </ThemeProvider>
  );
}
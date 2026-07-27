import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { ThemeProvider } from "./ThemeContext";

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/admin-login");
  }

  return (
    <ThemeProvider>
      {/* Arka plan çok hafif yumuşatıldı (slate-900'den slate-900/95'e doğru daha mat bir his) */}
      <div className="flex h-screen font-sans bg-slate-50 dark:bg-slate-900 transition-colors duration-300 selection:bg-[#02529C] selection:text-white">
        
        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Header - Saf beyaz yazılar slate-200 ile değiştirildi */}
          <header className="h-16 bg-white dark:bg-slate-800/90 backdrop-blur-md shadow-sm border-b border-slate-200 dark:border-slate-700/80 flex items-center justify-between px-8 z-10 transition-colors duration-300">
            <h2 className="text-lg font-black text-slate-800 dark:text-slate-200 transition-colors">Yönetim Paneli</h2>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-slate-300 rounded-full flex items-center justify-center font-black transition-colors border border-blue-100 dark:border-slate-600">
                {session.user.name.charAt(0)}
              </div>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors">
                {session.user.name}
              </span>
            </div>
          </header>

          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
            {children}
          </main>
          
        </div>
      </div>
    </ThemeProvider>
  );
}
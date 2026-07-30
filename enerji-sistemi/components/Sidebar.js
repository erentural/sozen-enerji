"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import NotificationBell from "./NotificationBell";
import { useTheme } from "@/app/admin/ThemeContext";
import { 
  Users, ClipboardList, LayoutDashboard, CalendarDays, 
  Settings, LogOut, FolderKanban, Mail, Globe, BookOpen, FileText
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { currentTheme } = useTheme(); 

  const menuItems = [
    { name: "Ana Sayfa", icon: LayoutDashboard, path: "/admin" },
    { name: "Mesajlar", icon: Mail, path: "/admin/mesajlar" },
    { name: "Projeler & İşler", icon: FolderKanban, path: "/admin/projeler" },
    { name: "Randevular", icon: CalendarDays, path: "/admin/randevular" },
    { name: "Kılavuz", icon: BookOpen, path: "/admin/kilavuz" },
    { name: "Müşteriler", icon: Users, path: "/admin/musteriler" },
    { name: "Teklif Talepleri", icon: ClipboardList, path: "/admin/teklifler" },
    { name: "Blog", icon: FileText, path: "/admin/blog" },
    { name: "Ayarlar", icon: Settings, path: "/admin/ayarlar" },
  ];

  return (
    <div className="w-64 bg-white dark:bg-slate-950/80 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800/80 flex flex-col h-screen shrink-0 transition-colors duration-300">
      
      <div className="h-16 flex items-center justify-between px-6 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800/80 transition-colors duration-300">
        <h1 className="text-xl font-black flex items-center gap-1">
          <span className={currentTheme.text}>Enerji</span>
          <span className="text-slate-900 dark:text-slate-200 transition-colors">Panel</span>
        </h1>
        <NotificationBell />
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link 
                  href={item.path}
                  className={`flex items-center px-6 py-3 text-sm font-bold transition-all duration-200 ${
                    isActive 
                      ? `${currentTheme.bg} text-white shadow-md border-r-4 border-slate-900 dark:border-slate-300` 
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800/80 space-y-1 transition-colors duration-300">
        <Link 
          href="/"
          className="flex items-center w-full px-4 py-2.5 text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200 rounded-xl transition-colors"
        >
          <Globe className="w-5 h-5 mr-3" />
          Siteye Git
        </Link>
        <button 
          onClick={() => signOut({ callbackUrl: '/admin-login' })}
          className="flex items-center w-full px-4 py-2.5 text-sm font-bold text-rose-500 dark:text-rose-400/90 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Çıkış Yap
        </button>
      </div>
    </div>
  );
}
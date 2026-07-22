"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import NotificationBell from "./NotificationBell";
import { 
  Users, 
  ClipboardList,
  LayoutDashboard, 
  CalendarDays, 
  Settings, 
  LogOut,
  FolderKanban,
  Mail,
  Globe,
  BookOpen
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  // "Ürünler" silindi. "href" olan yerler "path" olarak düzeltildi.
  const menuItems = [
    { name: "Ana Sayfa", icon: LayoutDashboard, path: "/admin" },
    { name: "Mesajlar", icon: Mail, path: "/admin/mesajlar" },
    { name: "Projeler & İşler", icon: FolderKanban, path: "/admin/projeler" },
    { name: "Randevular", icon: CalendarDays, path: "/admin/randevular" },
    { name: "Kılavuz", icon: BookOpen, path: "/admin/kilavuz" },
    { name: "Müşteriler", icon: Users, path: "/admin/musteriler" },
    { name: "Teklif Talepleri", icon: ClipboardList, path: "/admin/teklifler" },
    { name: "Ayarlar", icon: Settings, path: "/admin/ayarlar" },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-screen shrink-0">
      {/* Logo ve Bildirim Zili Alanı */}
      <div className="h-16 flex items-center justify-between px-6 bg-gray-950 border-b border-gray-800">
        <h1 className="text-xl font-bold text-blue-400">Enerji<span className="text-white">Panel</span></h1>
        
        {/* ZİLİ BURAYA EKLEDİK */}
        <NotificationBell />
      </div>

      {/* Menü Linkleri */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link 
                  href={item.path}
                  className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                    isActive 
                      ? "bg-blue-600 text-white border-r-4 border-blue-400" 
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
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

      {/* Alt Bölüm: Siteye Dön ve Çıkış Yap */}
      <div className="p-4 border-t border-gray-800 space-y-1">
        <Link 
          href="/"
          className="flex items-center w-full px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
        >
          <Globe className="w-5 h-5 mr-3" />
          Ana Sayfa
        </Link>
        <button 
          onClick={() => signOut({ callbackUrl: '/admin-login' })}
          className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Çıkış Yap
        </button>
      </div>
    </div>
  );
}
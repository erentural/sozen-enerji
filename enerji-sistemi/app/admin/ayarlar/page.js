"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { User, Lock, Save, AlertCircle, CheckCircle2 } from "lucide-react";

export default function AyarlarPage() {
  const { data: session, update } = useSession();
  
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [message, setMessage] = useState("");

  // Oturumdaki ismi forma otomatik doldur
  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          currentPassword: currentPassword || undefined, 
          newPassword: newPassword || undefined 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Ayarlarınız güncellendi.");
        setCurrentPassword("");
        setNewPassword("");
        
        // Session'daki ismi güncelle ki sağ üstteki isim anında değişsin
        await update({ name });
      } else {
        setStatus("error");
        setMessage(data.error || "Güncelleme başarısız oldu.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Sunucu ile iletişim kurulamadı.");
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900">Hesap Ayarları</h1>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            Profil ve Güvenlik
          </h2>
        </div>

        <div className="p-6">
          {status === "success" && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}
          
          {status === "error" && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Profil Bilgileri */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Kişisel Bilgiler</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Görüntülenen Adınız</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-posta Adresiniz</label>
                <input
                  type="email"
                  disabled
                  value={session?.user?.email || ""}
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-200 text-gray-500 rounded-lg cursor-not-allowed"
                  title="E-posta adresi güvenlik sebebiyle değiştirilemez."
                />
                <p className="text-xs text-gray-400 mt-1">E-posta adresi sistem girişinde kullanıldığı için değiştirilemez.</p>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Şifre Değiştirme */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center">
                <Lock className="w-4 h-4 mr-1"/> Şifre Değiştirme
              </h3>
              <p className="text-sm text-gray-500 mb-4">Şifrenizi değiştirmek istemiyorsanız bu alanları boş bırakabilirsiniz.</p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mevcut Şifreniz</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifreniz</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Yeni şifrenizi girin"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {status === "loading" ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                <Save className="w-4 h-4" />
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
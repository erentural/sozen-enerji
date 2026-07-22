"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [isLoginMode, setIsLoginMode] = useState(true); // Giriş mi Kayıt mı?
  const [error, setError] = useState("");
  
  // Form verileri
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isLoginMode) {
      // BURAYA MEVCUT GİRİŞ (LOGIN) KODLARIN GELECEK
      // Örn: signIn("credentials", { email, password })
    } else {
      // YENİ KAYIT (REGISTER) İŞLEMİ
      try {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error);
        } else {
          alert("Kaydınız başarıyla oluşturuldu! Şimdi giriş yapabilirsiniz.");
          setIsLoginMode(true); // Başarılı kayıttan sonra giriş ekranına döndür
        }
      } catch (err) {
        setError("Sunucuya bağlanılamadı.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {isLoginMode ? "Sisteme Giriş" : "Yeni Hesap Oluştur"}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {isLoginMode ? "Lütfen bilgilerinizi giriniz" : "Hızlıca müşteri kaydınızı tamamlayın"}
          </p>
        </div>

        {error && <div className="p-3 text-sm text-red-500 bg-red-50 rounded">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* SADECE KAYIT MODUNDA GÖRÜNECEK ALANLAR */}
          {!isLoginMode && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm text-gray-600">Ad</label>
                  <input type="text" name="firstName" required onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-gray-600">Soyad</label>
                  <input type="text" name="lastName" required onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
                </div>
              </div>
              <div>
                <label className="block mb-1 text-sm text-gray-600">Telefon Numarası</label>
                <input type="tel" name="phone" onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
              </div>
            </>
          )}

          {/* HER İKİ MODDA DA GÖRÜNECEK ALANLAR */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">E-posta Adresi</label>
            <input type="email" name="email" required placeholder="E-posta adresiniz" onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-600">Şifre</label>
            <input type="password" name="password" required placeholder="••••••••" onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
          </div>

          <button type="submit" className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
            {isLoginMode ? "Giriş Yap" : "Kayıt Ol"}
          </button>
        </form>

        <div className="text-center mt-4">
          <button 
            type="button" 
            onClick={() => setIsLoginMode(!isLoginMode)} 
            className="text-sm text-blue-600 hover:underline"
          >
            {isLoginMode ? "Hesabınız yok mu? Yeni müşteri kaydı oluşturun." : "Zaten hesabınız var mı? Giriş yapın."}
          </button>
        </div>

      </div>
    </div>
  );
}
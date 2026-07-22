"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function AuthPage() {
  const router = useRouter();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [error, setError] = useState("");
  
  // 1. YENİLİK: Form verilerine "countryCode" eklendi
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    countryCode: "+90", // Varsayılan Türkiye kodu
    phone: "",
    email: "",
    password: ""
  });

  // Standart veri değişimi (Ad, soyad, e-posta, şifre, ülke kodu için)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. YENİLİK: Sadece rakam kabul eden telefon fonksiyonu
  const handlePhoneChange = (e) => {
    // Regex ile rakam olmayan (\D) tüm karakterleri sileriz
    const onlyNumbers = e.target.value.replace(/\D/g, '');
    setFormData({ ...formData, phone: onlyNumbers });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isLoginMode) {
      // --- GERÇEK GİRİŞ YAPMA (LOGIN) İŞLEMİ ---
      try {
        const res = await signIn("credentials", {
          redirect: false, // Sayfanın otomatik yenilenmesini engeller, hatayı biz yakalarız
          email: formData.email,
          password: formData.password,
        });

        if (res?.error) {
          setError("E-posta veya şifre hatalı. Lütfen kontrol ediniz.");
        } else {
          // Giriş başarılıysa paneline yönlendir
          router.push("/"); // Eğer giriş yaptıktan sonra admin veya müşteri paneline gidecekse adresi buraya yaz (Örn: "/dashboard")
          router.refresh(); // Sayfa verilerini günceller
        }
      } catch (err) {
        setError("Giriş yapılırken sunucu tarafında bir hata oluştu.");
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
          
          {!isLoginMode && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm text-gray-600">Ad</label>
                  <input type="text" name="firstName" required onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-blue-500" />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-gray-600">Soyad</label>
                  <input type="text" name="lastName" required onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-blue-500" />
                </div>
              </div>
              
              {/* 4. YENİLİK: Ülke kodu ve Rakam kısıtlamalı telefon alanı */}
              <div>
                <label className="block mb-1 text-sm text-gray-600">Telefon Numarası</label>
                <div className="flex">
                  <select 
                    name="countryCode" 
                    value={formData.countryCode} 
                    onChange={handleChange}
                    className="px-2 py-2 border border-r-0 rounded-l-md bg-gray-50 text-gray-600 focus:outline-none"
                  >
                    <option value="+90">+90 (TR)</option>
                    <option value="+1">+1 (US)</option>
                    <option value="+44">+44 (UK)</option>
                    <option value="+49">+49 (DE)</option>
                    <option value="+33">+33 (FR)</option>
                    <option value="+81">+81 (JP)</option>
                    <option value="+61">+61 (AU)</option>
                    <option value="+91">+91 (IN)</option>
                    <option value="+86">+86 (CN)</option>
                    <option value="+7">+7 (RU)</option>
                  </select>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone}
                    onChange={handlePhoneChange} 
                    maxLength={10} // TR numaraları için başında 0 olmadan 10 hane (Örn: 5551234567)
                    placeholder="5XX XXX XX XX" 
                    className="w-full px-3 py-2 border rounded-r-md focus:outline-none focus:ring-1 focus:ring-blue-500" 
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block mb-1 text-sm text-gray-600">E-posta Adresi</label>
            <input type="email" name="email" required placeholder="E-posta adresiniz" onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-blue-500" />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-600">Şifre</label>
            <input type="password" name="password" required placeholder="••••••••" onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-blue-500" />
          </div>

          <button type="submit" className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
            {isLoginMode ? "Giriş Yap" : "Kayıt Ol"}
          </button>
        </form>

        <div className="text-center mt-4">
          <button 
            type="button" 
            onClick={() => setIsLoginMode(!isLoginMode)} 
            className="text-sm text-blue-600 hover:underline focus:outline-none"
          >
            {isLoginMode ? "Hesabınız yok mu? Yeni müşteri kaydı oluşturun." : "Zaten hesabınız var mı? Giriş yapın."}
          </button>
        </div>

      </div>
    </div>
  );
}
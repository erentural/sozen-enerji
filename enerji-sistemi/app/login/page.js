"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; 
import { signIn } from "next-auth/react";

export default function AuthPage() {
  const router = useRouter();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    countryCode: "+90",
    phone: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (e) => {
    const onlyNumbers = e.target.value.replace(/\D/g, '');
    setFormData({ ...formData, phone: onlyNumbers });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isLoginMode) {
      try {
        const res = await signIn("credentials", {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });

        if (res?.error) {
          setError("E-posta veya şifre hatalı. Lütfen kontrol ediniz.");
        } else {
          router.push("/portal"); 
          router.refresh();
        }
      } catch (err) {
        setError("Giriş yapılırken sunucu tarafında bir hata oluştu.");
      }
    } else {
      const fullPhone = formData.phone ? `${formData.countryCode}${formData.phone}` : "";
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: fullPhone
      };

      try {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error);
        } else {
          alert("Kaydınız başarıyla oluşturuldu! Şimdi giriş yapabilirsiniz.");
          setIsLoginMode(true);
          setFormData({ ...formData, password: "", phone: "" });
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
                    <option value="+1">+1 (ABD)</option>
                    <option value="+44">+44 (UK)</option>
                    <option value="+49">+49 (DE)</option>
                    <option value="+33">+33 (FR)</option>
                    <option value="+39">+39 (IT)</option>
                    <option value="+7">+7 (RU)</option>
                    <option value="+81">+81 (JP)</option>
                    <option value="+86">+86 (CN)</option>
                    <option value="+91">+91 (IN)</option>
                  </select>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone}
                    onChange={handlePhoneChange} 
                    maxLength={10} 
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
            {/* YENİ: Şifre etiketi ve Şifremi Unuttum linki aynı satırda */}
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm text-gray-600">Şifre</label>
              {isLoginMode && (
                <Link 
                  href="/sifremi-unuttum" 
                  className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Şifremi unuttum
                </Link>
              )}
            </div>
            <input type="password" name="password" required placeholder="••••••••" onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-blue-500" />
          </div>

          <button type="submit" className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
            {isLoginMode ? "Giriş Yap" : "Kayıt Ol"}
          </button>
        </form>

        <div className="text-center mt-6 space-y-4">
          <button 
            type="button" 
            onClick={() => setIsLoginMode(!isLoginMode)} 
            className="text-sm text-blue-600 hover:underline focus:outline-none block w-full"
          >
            {isLoginMode ? "Hesabınız yok mu? Yeni müşteri kaydı oluşturun." : "Zaten hesabınız var mı? Giriş yapın."}
          </button>

          <Link 
            href="/" 
            className="inline-flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Ana Sayfaya Dön
          </Link>
        </div>

      </div>
    </div>
  );
}
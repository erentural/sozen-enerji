"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/sifremi-unuttum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        setMessage("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen gelen kutunuzu (ve varsa spam/gereksiz klasörünü) kontrol ediniz.");
      } else {
        setError(data.error || "Bir hata oluştu.");
      }
    } catch (err) {
      setError("Sunucu ile iletişim kurulamadı. Lütfen daha sonra tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
        
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            {isSuccess ? <CheckCircle2 className="w-6 h-6" /> : <Mail className="w-6 h-6" />}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Şifremi Unuttum</h1>
          <p className="mt-2 text-sm text-gray-500">
            {isSuccess 
              ? "E-posta başarıyla gönderildi." 
              : "Sisteme kayıtlı e-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim."}
          </p>
        </div>

        {error && <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg font-medium">{error}</div>}
        {message && <div className="p-4 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg font-medium leading-relaxed">{message}</div>}

        {!isSuccess && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">E-posta Adresi</label>
              <input 
                type="email" 
                required 
                placeholder="ornek@mail.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-sm" 
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3 text-white font-bold bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isLoading ? "Gönderiliyor..." : "Bağlantı Gönder"}
            </button>
          </form>
        )}

        <div className="text-center pt-2">
          <Link 
            href="/login" 
            className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Giriş Ekranına Dön
          </Link>
        </div>

      </div>
    </div>
  );
}
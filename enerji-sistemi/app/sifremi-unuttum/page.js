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
    // dark:bg-slate-950 ve transition eklendi
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-slate-900 rounded-xl shadow-md dark:shadow-none border border-transparent dark:border-slate-800 transition-colors duration-300">
        
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
            {isSuccess ? <CheckCircle2 className="w-6 h-6" /> : <Mail className="w-6 h-6" />}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 transition-colors">Şifremi Unuttum</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-slate-400 transition-colors">
            {isSuccess 
              ? "E-posta başarıyla gönderildi." 
              : "Sisteme kayıtlı e-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim."}
          </p>
        </div>

        {/* Hata Mesajı Karanlık Mod Uyumu */}
        {error && (
          <div className="p-3 text-sm text-red-500 dark:text-rose-400 bg-red-50 dark:bg-rose-900/30 rounded-lg font-medium border border-transparent dark:border-rose-900/50 transition-colors">
            {error}
          </div>
        )}
        
        {/* Başarı Mesajı Karanlık Mod Uyumu */}
        {message && (
          <div className="p-4 text-sm text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-900/50 rounded-lg font-medium leading-relaxed transition-colors">
            {message}
          </div>
        )}

        {!isSuccess && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-slate-300 transition-colors">E-posta Adresi</label>
              <input 
                type="email" 
                required 
                placeholder="ornek@mail.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 transition-all text-sm" 
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3 text-white font-bold bg-blue-600 dark:bg-blue-500 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-70 flex items-center justify-center gap-2 shadow-sm"
            >
              {isLoading ? "Gönderiliyor..." : "Bağlantı Gönder"}
            </button>
          </form>
        )}

        <div className="text-center pt-2">
          <Link 
            href="/login" 
            className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Giriş Ekranına Dön
          </Link>
        </div>

      </div>
    </div>
  );
}
"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, CheckCircle2, ArrowLeft, AlertCircle } from "lucide-react";

// Next.js useSearchParams kullandığı için Suspense ile sarmalamak en iyi pratiktir
export default function ResetPasswordPage() {
  return (
    // Yükleniyor yazısının karanlık mod uyumu eklendi
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 text-gray-500 dark:text-slate-400 transition-colors duration-300">Yükleniyor...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Girdiğiniz şifreler birbiriyle eşleşmiyor.");
      return;
    }

    if (password.length < 6) {
      setError("Şifreniz en az 6 karakterden olmalıdır.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/sifre-sifirla", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        setMessage("Şifreniz başarıyla güncellendi! Giriş sayfasına yönlendiriliyorsunuz...");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(data.error || "Şifre sıfırlama işlemi başarısız oldu.");
      }
    } catch (err) {
      setError("Sunucu ile iletişim kurulamadı. Lütfen daha sonra tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      // Geçersiz Bağlantı Ekranı - Karanlık Mod Uyumu
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="w-full max-w-md p-8 bg-white dark:bg-slate-900 rounded-xl shadow-md dark:shadow-none border border-transparent dark:border-slate-800 text-center space-y-4 transition-colors duration-300">
          <AlertCircle className="w-12 h-12 text-red-500 dark:text-rose-500 mx-auto transition-colors" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-slate-100 transition-colors">Geçersiz Bağlantı</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 transition-colors">Bu şifre sıfırlama bağlantısı geçersiz veya eksik.</p>
          <Link href="/login" className="inline-block w-full py-3 text-white font-bold bg-blue-600 dark:bg-blue-500 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-sm">
            Giriş Ekranına Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    // Yeni Şifre Belirleme Ekranı - Karanlık Mod Uyumu
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-slate-900 rounded-xl shadow-md dark:shadow-none border border-transparent dark:border-slate-800 transition-colors duration-300">
        
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
            {isSuccess ? <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-emerald-500" /> : <Lock className="w-6 h-6" />}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 transition-colors">Yeni Şifre Belirleme</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-slate-400 transition-colors">Lütfen hesabınız için yeni bir şifre giriniz.</p>
        </div>

        {/* Hata ve Başarı Mesajları */}
        {error && <div className="p-3 text-sm text-red-500 dark:text-rose-400 bg-red-50 dark:bg-rose-900/30 rounded-lg font-medium border border-transparent dark:border-rose-900/50 transition-colors">{error}</div>}
        {message && <div className="p-4 text-sm text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-900/50 rounded-lg font-medium text-center transition-colors">{message}</div>}

        {!isSuccess && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-slate-300 transition-colors">Yeni Şifre</label>
              <input 
                type="password" 
                required 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 transition-all text-sm" 
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-slate-300 transition-colors">Yeni Şifre (Tekrar)</label>
              <input 
                type="password" 
                required 
                placeholder="••••••••" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 transition-all text-sm" 
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3 text-white font-bold bg-blue-600 dark:bg-blue-500 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-70 flex items-center justify-center gap-2 shadow-sm"
            >
              {isLoading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
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
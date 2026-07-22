"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (res?.error) {
        setError("E-posta veya şifre hatalı.");
      } else {
        // Giriş başarılıysa doğrudan admin yönetim paneline atar
        router.push("/admin"); 
        router.refresh();
      }
    } catch (err) {
      setError("Giriş yapılırken sunucu hatası oluştu.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 rounded-xl shadow-2xl border border-slate-700">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {/* Kilit İkonu */}
            <div className="p-3 bg-blue-500/20 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Yönetici Girişi</h1>
          <p className="mt-2 text-sm text-slate-400">Sadece yetkili personeller giriş yapabilir.</p>
        </div>

        {error && <div className="p-3 text-sm text-red-200 bg-red-900/50 border border-red-800 rounded">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-slate-300">Yönetici E-posta</label>
            <input 
              type="email" 
              name="email" 
              required 
              onChange={handleChange} 
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white focus:outline-none focus:border-blue-500" 
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-slate-300">Şifre</label>
            <input 
              type="password" 
              name="password" 
              required 
              onChange={handleChange} 
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white focus:outline-none focus:border-blue-500" 
            />
          </div>

          <button type="submit" className="w-full py-2 mt-4 text-white font-medium bg-blue-600 rounded-md hover:bg-blue-500 transition-colors">
            Sisteme Giriş Yap
          </button>
        </form>

        <div className="text-center mt-6">
          <Link href="/" className="inline-flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
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
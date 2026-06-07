"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function TeklifAlPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  });
  
  const [status, setStatus] = useState("idle");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", phone: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
      <section className="bg-[#02529C] py-16 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Hemen Teklif Alın</h1>
        <p className="text-blue-100 max-w-2xl mx-auto text-lg">İhtiyaçlarınızı bize yazın, uzman mühendislerimiz size en uygun projeyi hazırlasın.</p>
      </section>

      <section className="max-w-3xl mx-auto px-6 lg:px-8 py-16">
        <div className="bg-white p-10 rounded-xl shadow-[0_10px_40px_rgb(0,0,0,0.08)] border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Proje Detayları</h2>
            <p className="text-gray-500 mt-2">Bilgilerinizi eksiksiz doldurmanız, size daha hızlı dönüş yapmamızı sağlar.</p>
          </div>
          
          {status === "success" ? (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-10 flex flex-col items-center justify-center text-center">
              <CheckCircle2 className="w-20 h-20 text-green-500 mb-6" />
              <h3 className="text-2xl font-bold mb-3">Talebiniz Alındı!</h3>
              <p className="text-lg mb-8">Mesajınız uzman ekibimize başarıyla ulaştı. En kısa sürede sizinle iletişime geçeceğiz.</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setStatus("idle")}
                  className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded hover:bg-gray-50 transition-colors"
                >
                  Yeni Form Doldur
                </button>
                <Link 
                  href="/"
                  className="px-6 py-3 bg-[#02529C] text-white font-bold rounded flex items-center gap-2 hover:bg-blue-800 transition-colors"
                >
                  Anasayfaya Dön <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Adınız Soyadınız *</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:ring-2 focus:ring-[#FFC107] outline-none" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Telefon Numaranız *</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:ring-2 focus:ring-[#FFC107] outline-none" 
                    required 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">E-Posta Adresiniz (Opsiyonel)</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:ring-2 focus:ring-[#FFC107] outline-none" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Proje Detayları / Mesajınız *</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6" 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:ring-2 focus:ring-[#FFC107] outline-none" 
                  required
                ></textarea>
              </div>
              
              {status === "error" && (
                <p className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded">Bir hata oluştu. Lütfen bilgilerinizi kontrol edip tekrar deneyin.</p>
              )}

              <button 
                type="submit" 
                disabled={status === "submitting"}
                className="w-full bg-[#FFC107] text-gray-900 font-black text-lg py-5 rounded hover:bg-yellow-500 transition-colors disabled:opacity-70 shadow-lg"
              >
                {status === "submitting" ? "Gönderiliyor..." : "Talebi Gönder"}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
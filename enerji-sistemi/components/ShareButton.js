"use client";

import { useState, useEffect } from "react";
import { Check, Linkedin, MessageCircle, Link as LinkIcon } from "lucide-react";

export default function ShareButton({ title }) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");

  // Sayfa yüklendiğinde tarayıcıdaki tam URL'yi alır
  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const copyToClipboard = () => {
    if (url) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // 2 saniye sonra "Kopyalandı" yazısı kaybolur
    }
  };

  const shareViaWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title + " - " + url)}`, '_blank');
  };

  const shareViaLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3">
      <span className="text-sm font-bold text-slate-500 mr-2">Yazıyı Paylaş:</span>
      
      <div className="flex items-center gap-2">
        <button onClick={shareViaWhatsApp} className="p-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-xl transition-colors shadow-sm" title="WhatsApp'ta Paylaş">
          <MessageCircle className="w-5 h-5" />
        </button>
        
        <button onClick={shareViaLinkedIn} className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-colors shadow-sm" title="LinkedIn'de Paylaş">
          <Linkedin className="w-5 h-5" />
        </button>
        
        <button onClick={copyToClipboard} className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-sm rounded-xl transition-colors shadow-sm min-w-[140px] justify-center">
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <LinkIcon className="w-4 h-4" />}
          {copied ? "Kopyalandı!" : "Linki Kopyala"}
        </button>
      </div>
    </div>
  );
}
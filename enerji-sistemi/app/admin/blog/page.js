"use client";

import { useState, useEffect } from "react";
import { FileText, PlusCircle, X, CheckCircle2, Clock, Image as ImageIcon, Eye, EyeOff, Edit, Trash2 } from "lucide-react";
import { useTheme } from "../ThemeContext";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null); // YENİ: Düzenlenen yazının ID'sini tutar
  const { currentTheme } = useTheme();

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    imageUrl: "",
    author: "",
    published: true
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/admin/blog");
      if (res.ok) {
        setPosts(await res.json());
      }
    } catch (error) {
      console.error("Yazılar alınamadı", error);
    } finally {
      setLoading(false);
    }
  };

  // YENİ: Modalı açıp formu boşaltan veya verilerle dolduran fonksiyon
  const openModal = (post = null) => {
    if (post) {
      setEditingId(post.id);
      setFormData({
        title: post.title,
        summary: post.summary || "",
        content: post.content,
        imageUrl: post.imageUrl || "",
        author: post.author || "",
        published: post.published
      });
    } else {
      setEditingId(null);
      setFormData({ title: "", summary: "", content: "", imageUrl: "", author: "", published: true });
    }
    setIsModalOpen(true);
  };

  // YENİ: Yazı silme fonksiyonu
  const handleDelete = async (id) => {
    if (!confirm("Bu yazıyı kalıcı olarak silmek istediğinize emin misiniz?")) return;

    try {
      const res = await fetch(`/api/admin/blog?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchPosts();
      } else {
        alert("Silme işlemi başarısız oldu.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // GÜNCELLENDİ: Hem yeni ekleme hem de düzenleme için tek fonksiyon
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = "/api/admin/blog";
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { ...formData, id: editingId } : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchPosts();
      } else {
        alert("İşlem sırasında bir hata oluştu.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-sans transition-colors duration-300 pb-10">
      
      {/* BAŞLIK ALANI */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-200 flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${currentTheme.bg} bg-opacity-10 dark:bg-opacity-20 ${currentTheme.text}`}>
              <FileText className="w-7 h-7" />
            </div>
            Blog & Haber Yönetimi
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Sektörel haberleri ve duyuruları buradan yönetin.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className={`flex items-center gap-2 px-5 py-3 ${currentTheme.bg} ${currentTheme.hoverBg} text-white font-bold rounded-xl transition-all shadow-md`}
        >
          <PlusCircle className="w-5 h-5" /> Yeni Yazı Ekle
        </button>
      </div>

      {/* İÇERİK LİSTESİ */}
      <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-700/80 backdrop-blur-sm">
        {loading ? (
          <div className="flex justify-center py-12"><Clock className="w-8 h-8 animate-spin text-slate-400" /></div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-slate-400 dark:text-slate-500">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="font-medium">Henüz yayınlanmış bir haber veya makale yok.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post.id} className="group border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900/50 hover:shadow-md transition-all relative">
                <div className="h-40 bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                  {post.imageUrl ? (
                    <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400"><ImageIcon className="w-8 h-8" /></div>
                  )}
                  {/* Etiket Sol Üste Alındı */}
                  <div className="absolute top-3 left-3">
                    {post.published ? (
                      <span className="bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1"><Eye className="w-3 h-3" /> Yayında</span>
                    ) : (
                      <span className="bg-slate-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1"><EyeOff className="w-3 h-3" /> Taslak</span>
                    )}
                  </div>
                  {/* YENİ EKLENEN: Düzenle ve Sil Butonları (Sağ Üstte) */}
                  <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button onClick={() => openModal(post)} className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm transition-colors" title="Düzenle">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(post.id)} className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-md shadow-sm transition-colors" title="Sil">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">{post.summary}</p>
                  <div className="flex justify-between items-center text-xs font-medium text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-4">
                    <span>{new Date(post.createdAt).toLocaleDateString('tr-TR')}</span>
                    <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> {post.viewCount} Okunma</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* YENİ YAZI / DÜZENLEME MODALI */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 dark:border-slate-800 relative">
            <div className="sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center z-10">
              <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
                {editingId ? "Haberi Düzenle" : "Yeni Blog & Haber Ekle"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Yazı Başlığı</label>
                <input required type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100" placeholder="Örn: Güneş Enerjisinde 2026 Teşvikleri Açıklandı" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Yazar Adı</label>
                <input type="text" value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100" placeholder="Örn: Sözen Enerji Yönetimi" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Kısa Özet (Ana sayfada görünecek)</label>
                <textarea rows={2} value={formData.summary} onChange={(e) => setFormData({...formData, summary: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 resize-none" placeholder="Makalenin ilgi çekici kısa bir özeti..." />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Kapak Fotoğrafı URL (Opsiyonel)</label>
                <input type="text" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100" placeholder="https://ornek-resim-linki.com/foto.jpg" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Makale İçeriği (Tam Metin)</label>
                <textarea required rows={8} value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100" placeholder="Yazının tüm detaylarını buraya ekleyin..." />
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <input type="checkbox" id="published" checked={formData.published} onChange={(e) => setFormData({...formData, published: e.target.checked})} className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <label htmlFor="published" className="font-bold text-sm text-slate-700 dark:text-slate-300 cursor-pointer">Yazıyı yayınla (İşareti kaldırırsanız taslak olarak kaydedilir)</label>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button type="submit" disabled={isSubmitting} className={`px-8 py-3 ${currentTheme.bg} ${currentTheme.hoverBg} text-white font-bold rounded-xl transition-all shadow-md disabled:opacity-50`}>
                  {isSubmitting ? "Kaydediliyor..." : editingId ? "Değişiklikleri Kaydet" : "Yazıyı Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
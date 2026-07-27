"use client";

import { useState, useEffect } from "react";
import { FolderKanban, Plus, Activity, Send, Trash2, Edit2, X, Image as ImageIcon } from "lucide-react";
import { useTheme } from "../ThemeContext"; // YENİ: Global Tema Context'i

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingEmailId, setSendingEmailId] = useState(null);
  
  // Tema Yöneticisi
  const { currentTheme } = useTheme();

  // Ortak Form State'i
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    progress: 0,
    customerName: "",
    customerEmail: "",
    imageUrl: "" 
  });

  // Düzenleme Modu Kontrolü
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/admin/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Projeler çekilemedi", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Dosya boyutu 2MB'den küçük olmalıdır.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, imageUrl: "" });
  };

  const handleEditClick = (project) => {
    setEditingId(project.id);
    setFormData({
      title: project.title || "",
      description: project.description || "",
      location: project.location || "",
      progress: project.progress || 0,
      customerName: project.customer?.name || "", 
      customerEmail: project.customer?.email || "",
      imageUrl: project.imageUrl || ""
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", location: "", progress: 0, customerName: "", customerEmail: "", imageUrl: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingId ? `/api/admin/projects/${editingId}` : "/api/admin/projects";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), 
      });

      const data = await res.json(); 

      if (res.ok) {
        cancelEdit();
        fetchProjects();
        alert(editingId ? "Proje başarıyla güncellendi." : "Yeni proje başarıyla atandı.");
      } else {
        alert(data.error || "Proje kaydedilirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("İşlem başarısız", error);
      alert("Sunucuya bağlanırken bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu projeyi tamamen silmek istediğinize emin misiniz?")) return;
    
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects(projects.filter(p => p.id !== id));
        if (editingId === id) cancelEdit();
      }
    } catch (error) {
      console.error("Proje silinemedi", error);
    }
  };

  const handleNotify = async (projectId) => {
    setSendingEmailId(projectId); 
    
    try {
      const res = await fetch(`/api/admin/projects/${projectId}/notify`, {
        method: "POST"
      });
      
      if (res.ok) {
        alert("Proje durumu müşteriye başarıyla mail olarak iletildi!");
      } else {
        alert("Mail gönderilirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Bildirim hatası:", error);
    } finally {
      setSendingEmailId(null); 
    }
  };

  if (loading) return <div className="p-8 text-slate-500 font-medium">Projeler yükleniyor...</div>;

  return (
    <div className="p-8 max-w-7xl font-sans transition-colors duration-300">
      
      {/* Sayfa Başlığı */}
      <h1 className="text-3xl font-black text-slate-900 dark:text-slate-200 mb-8 flex items-center gap-3 transition-colors">
        <FolderKanban className={`w-8 h-8 ${currentTheme.text}`} /> Projeler ve İş Takibi
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SOL KOLON: Form */}
        <div className="lg:col-span-1">
          <div className={`bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-sm border p-6 sticky top-8 transition-colors duration-300 ${
            editingId ? `${currentTheme.border} shadow-lg ring-1 ${currentTheme.focus.replace('focus:', '')}` : 'border-slate-100 dark:border-slate-700/80'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-lg font-black flex items-center transition-colors ${editingId ? currentTheme.text : 'text-slate-900 dark:text-slate-200'}`}>
                {editingId ? <Edit2 className="w-5 h-5 mr-2" /> : <Plus className={`w-5 h-5 mr-2 ${currentTheme.text}`} />}
                {editingId ? "Projeyi Güncelle" : "Yeni İş / Proje Ata"}
              </h2>
              {editingId && (
                <button onClick={cancelEdit} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 p-1 rounded-lg transition-colors" title="İptal Et">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 border-b border-slate-100 dark:border-slate-700/80 pb-2 transition-colors">
                  Proje Detayları
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-600 dark:text-slate-300 mb-1 transition-colors">İşin Adı</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Örn: Çatı GES Kurulumu" className={`w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-1 ${currentTheme.focus} transition-colors`} required />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-600 dark:text-slate-300 mb-1 transition-colors">Kısa Açıklama</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows="2" placeholder="Yapılacak işlemler..." className={`w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-1 ${currentTheme.focus} resize-none transition-colors`} required></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-600 dark:text-slate-300 mb-1 transition-colors">Proje Lokasyonu / Adresi</label>
                    <input 
                      type="text" 
                      name="location"
                      placeholder="Örn: İstanbul, Levent Ofis"
                      value={formData.location} 
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-1 ${currentTheme.focus} transition-colors`}
                    />
                  </div>
                  
                  {/* Görsel Yükleme Alanı - Karanlık Mod Uyumlu */}
                  <div>
                    <label className="block text-xs font-black text-slate-600 dark:text-slate-300 mb-1 transition-colors">Proje Görseli (Opsiyonel)</label>
                    
                    {!formData.imageUrl ? (
                      <div className="flex items-center justify-center w-full mt-1">
                        <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-slate-200 dark:border-slate-700/80 border-dashed rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <ImageIcon className="w-6 h-6 mb-2 text-slate-400 dark:text-slate-500" />
                            <p className="mb-1 text-xs text-slate-500 dark:text-slate-400 font-bold">Yüklemek için tıklayın</p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">PNG, JPG (Max: 2MB)</p>
                          </div>
                          <input type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleImageUpload} />
                        </label>
                      </div>
                    ) : (
                      <div className="relative mt-2">
                        <img src={formData.imageUrl} alt="Önizleme" className="w-full h-32 object-cover rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-sm" />
                        <button 
                          type="button" 
                          onClick={removeImage}
                          className="absolute top-2 right-2 p-1.5 bg-white dark:bg-slate-800 rounded-lg text-rose-500 shadow-sm hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                          title="Görseli Kaldır"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-600 dark:text-slate-300 mb-1 flex justify-between transition-colors">
                      <span>İlerleme Yüzdesi (%)</span>
                      <span className={`${currentTheme.text} font-bold`}>%{formData.progress}</span>
                    </label>
                    <input 
                      type="range" 
                      name="progress" 
                      min="0" max="100" 
                      value={formData.progress} 
                      onChange={handleChange} 
                      className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer transition-colors"
                      style={{ accentColor: currentTheme.bg.includes('blue') ? '#02529C' : currentTheme.bg.includes('amber') ? '#f59e0b' : '#059669' }}
                    />
                  </div>
                </div>
              </div>

              <div className={editingId ? "opacity-50 pointer-events-none" : ""}>
                <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 border-b border-slate-100 dark:border-slate-700/80 pb-2 mt-6 transition-colors">
                  Müşteri Bilgileri {editingId && "(Değiştirilemez)"}
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-600 dark:text-slate-300 mb-1 transition-colors">Müşteri Adı / Firma</label>
                    <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} placeholder="Örn: Ahmet Yılmaz" className={`w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-1 ${currentTheme.focus} transition-colors`} required={!editingId} />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-600 dark:text-slate-300 mb-1 transition-colors">Müşteri E-posta</label>
                    <input type="email" name="customerEmail" value={formData.customerEmail} onChange={handleChange} placeholder="ahmet@email.com" className={`w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-1 ${currentTheme.focus} transition-colors`} required={!editingId} />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className={`w-full ${currentTheme.bg} ${currentTheme.hoverBg} text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-70 mt-4 shadow-sm flex justify-center items-center gap-2`}>
                {isSubmitting ? "Kaydediliyor..." : editingId ? "Değişiklikleri Kaydet" : "Projeyi Oluştur"}
              </button>
            </form>
          </div>
        </div>

        {/* SAĞ KOLON: Proje Listesi */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/80 p-6 md:p-8 transition-colors duration-300">
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-200 mb-6 flex items-center transition-colors">
              <Activity className={`w-6 h-6 mr-3 ${currentTheme.text}`} /> Devam Eden İşler
            </h2>

            {projects.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-sm py-12 text-center border-2 border-slate-100 dark:border-slate-700/80 border-dashed rounded-2xl transition-colors">Aktif bir proje bulunmuyor.</p>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className={`border rounded-2xl p-5 relative group transition-colors ${
                    editingId === project.id 
                      ? `${currentTheme.border} bg-slate-50 dark:bg-slate-900/50` 
                      : 'border-slate-100 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-500'
                  }`}>
                    
                    {/* Sağ Üst Düzenle/Sil İkonları */}
                    <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button onClick={() => handleEditClick(project)} className={`p-2 text-slate-400 ${currentTheme.text.replace('text-', 'hover:text-')} hover:bg-slate-100 dark:hover:bg-slate-700/80 rounded-lg transition-colors bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-sm`} title="Düzenle">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(project.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-sm" title="Projeyi Sil">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-5">
                      {/* Varsa Proje Görseli */}
                      {project.imageUrl && (
                        <div className="shrink-0">
                          <img src={project.imageUrl} alt={project.title} className="w-full sm:w-36 h-36 object-cover rounded-xl border border-slate-100 dark:border-slate-700/80" />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <div className="flex items-start md:items-center gap-3 mb-2 flex-col md:flex-row pr-16 md:pr-20">
                          <h3 className="font-black text-slate-900 dark:text-slate-200 text-lg transition-colors">{project.title}</h3>
                          <span className="bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 text-xs px-3 py-1 rounded-full font-bold border border-slate-200 dark:border-slate-600/50 transition-colors">
                            {project.customer?.name || "Bilinmiyor"} 
                          </span>
                        </div>
                        
                        {project.location && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium flex items-center transition-colors">
                            <span className="mr-1.5 opacity-70">📍</span> {project.location}
                          </p>
                        )}
                        
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 font-medium transition-colors">{project.description}</p>
                        
                        <div className="mb-5">
                          <div className="flex justify-between text-xs font-black text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider transition-colors">
                            <span>Tamamlanma Durumu</span>
                            <span className={currentTheme.text}>%{project.progress}</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-700/50 rounded-full h-2.5 transition-colors">
                            <div className={`${currentTheme.bg} h-2.5 rounded-full transition-all duration-700 ease-out`} style={{ width: `${project.progress}%` }}></div>
                          </div>
                        </div>

                        <div className="flex justify-end border-t border-slate-100 dark:border-slate-700/80 pt-4 mt-2 transition-colors">
                         <button 
                            onClick={() => handleNotify(project.id)}
                            disabled={sendingEmailId === project.id}
                            className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm ${
                              sendingEmailId === project.id 
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed' 
                                : 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-100 dark:border-emerald-800/50'
                            }`}
                          >
                            <Send className={`w-3.5 h-3.5 ${sendingEmailId === project.id ? 'animate-pulse' : ''}`} /> 
                            {sendingEmailId === project.id ? 'Gönderiliyor...' : 'Durumu Mail ile Bildir'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
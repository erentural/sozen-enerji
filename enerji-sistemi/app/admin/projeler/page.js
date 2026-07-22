"use client";

import { useState, useEffect } from "react";
import { FolderKanban, Plus, Activity, Send, Trash2, Edit2, X, Image as ImageIcon } from "lucide-react";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingEmailId, setSendingEmailId] = useState(null);
  
  // Ortak Form State'i (location ve imageUrl eklendi)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    progress: 0,
    customerName: "",
    customerEmail: "",
    imageUrl: "" // YENİ: Görsel için alan
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

  // YENİ: Yüklenen resmi Base64 formatına çeviren fonksiyon
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 2MB Sınırı Kontrolü
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

  // YENİ: Yüklenen resmi formdan silme fonksiyonu
  const removeImage = () => {
    setFormData({ ...formData, imageUrl: "" });
  };

  // Düzenleme Modunu Başlat
  const handleEditClick = (project) => {
    setEditingId(project.id);
    setFormData({
      title: project.title || "",
      description: project.description || "",
      location: project.location || "",
      progress: project.progress || 0,
      customerName: project.customer?.name || "", 
      customerEmail: project.customer?.email || "",
      imageUrl: project.imageUrl || "" // Düzenlerken görseli de getir
    });
  };

  // Düzenleme Modundan Çık
  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", location: "", progress: 0, customerName: "", customerEmail: "", imageUrl: "" });
  };

  // Formu Gönder (Yeni Ekle veya Güncelle)
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

      // YENİ: Backend'den dönen cevabı (hata mesajları dahil) JSON olarak okuyoruz
      const data = await res.json(); 

      if (res.ok) {
        cancelEdit();
        fetchProjects();
        alert(editingId ? "Proje başarıyla güncellendi." : "Yeni proje başarıyla atandı.");
      } else {
        // YENİ: Eğer res.ok değilse (örneğin müşteri bulunamadıysa), backend'den gelen hatayı ekrana bas
        alert(data.error || "Proje kaydedilirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("İşlem başarısız", error);
      alert("Sunucuya bağlanırken bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Projeyi Sil
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

  // Mail Gönderme İşlemi
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

  if (loading) return <div className="p-8 text-gray-500 font-medium">Projeler yükleniyor...</div>;

  return (
    <div className="p-8 max-w-7xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Projeler ve İş Takibi</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sol Kolon: Form */}
        <div className="lg:col-span-1">
          <div className={`bg-white rounded-xl shadow-sm border p-6 sticky top-8 transition-colors ${editingId ? 'border-[#02529C] ring-1 ring-[#02529C]' : 'border-gray-200'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-lg font-bold flex items-center ${editingId ? 'text-[#02529C]' : 'text-gray-900'}`}>
                {editingId ? <Edit2 className="w-5 h-5 mr-2" /> : <FolderKanban className="w-5 h-5 mr-2 text-blue-600" />}
                {editingId ? "Projeyi Güncelle" : "Yeni İş/Proje Ata"}
              </h2>
              {editingId && (
                <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-700" title="İptal Et">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 border-b pb-2">Proje Detayları</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">İşin Adı</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Örn: Çatı GES Kurulumu" className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-blue-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Kısa Açıklama</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows="2" placeholder="Yapılacak işlemler..." className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-blue-500" required></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Proje Lokasyonu / Adresi</label>
                    <input 
                      type="text" 
                      name="location"
                      placeholder="Örn: İstanbul, Levent Ofis"
                      value={formData.location} 
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  
                  {/* YENİ: Görsel Yükleme Alanı */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Proje Görseli (Opsiyonel)</label>
                    
                    {!formData.imageUrl ? (
                      <div className="flex items-center justify-center w-full mt-1">
                        <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <ImageIcon className="w-6 h-6 mb-2 text-gray-500" />
                            <p className="mb-1 text-xs text-gray-500"><span className="font-semibold">Yüklemek için tıklayın</span></p>
                            <p className="text-[10px] text-gray-400">PNG, JPG (Max: 2MB)</p>
                          </div>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/png, image/jpeg, image/webp" 
                            onChange={handleImageUpload} 
                          />
                        </label>
                      </div>
                    ) : (
                      <div className="relative mt-2">
                        <img src={formData.imageUrl} alt="Önizleme" className="w-full h-32 object-cover rounded-lg border border-gray-200" />
                        <button 
                          type="button" 
                          onClick={removeImage}
                          className="absolute top-2 right-2 p-1 bg-white rounded-full text-red-500 shadow hover:bg-red-50 transition-colors"
                          title="Görseli Kaldır"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex justify-between">
                      <span>İlerleme Yüzdesi (%)</span>
                      <span className="text-blue-600 font-bold">%{formData.progress}</span>
                    </label>
                    <input type="range" name="progress" min="0" max="100" value={formData.progress} onChange={handleChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#02529C]" />
                  </div>
                </div>
              </div>

              <div className={editingId ? "opacity-50 pointer-events-none" : ""}>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 border-b pb-2 mt-6">Müşteri Bilgileri {editingId && "(Değiştirilemez)"}</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Müşteri Adı / Firma</label>
                    <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} placeholder="Örn: Ahmet Yılmaz" className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-blue-500" required={!editingId} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Müşteri E-posta</label>
                    <input type="email" name="customerEmail" value={formData.customerEmail} onChange={handleChange} placeholder="ahmet@email.com" className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-blue-500" required={!editingId} />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className={`w-full text-white font-bold py-3 rounded transition-colors disabled:opacity-70 mt-4 shadow-sm ${editingId ? 'bg-[#02529C] hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'}`}>
                {isSubmitting ? "Kaydediliyor..." : editingId ? "Değişiklikleri Kaydet" : "Projeyi Oluştur"}
              </button>
            </form>
          </div>
        </div>

        {/* Sağ Kolon: Proje Listesi */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-600" /> Devam Eden İşler
            </h2>

            {projects.length === 0 ? (
              <p className="text-gray-500 text-sm py-10 text-center border-2 border-dashed rounded-xl">Aktif bir proje bulunmuyor.</p>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className={`border rounded-xl p-5 relative group transition-colors ${editingId === project.id ? 'border-[#02529C] bg-blue-50/20' : 'border-gray-100 hover:border-blue-200'}`}>
                    
                    {/* Sağ Üst Düzenle/Sil İkonları */}
                    <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button onClick={() => handleEditClick(project)} className="p-2 text-gray-400 hover:text-[#02529C] hover:bg-blue-50 rounded-lg transition-colors bg-white/80 backdrop-blur-sm shadow-sm" title="Düzenle">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(project.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors bg-white/80 backdrop-blur-sm shadow-sm" title="Projeyi Sil">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-5">
                      {/* Varsa Proje Görseli */}
                      {project.imageUrl && (
                        <div className="shrink-0">
                          <img src={project.imageUrl} alt={project.title} className="w-full sm:w-32 h-32 object-cover rounded-lg border border-gray-200" />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1 pr-16">
                          <h3 className="font-bold text-gray-900 text-lg">{project.title}</h3>
                          <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded font-semibold">
                            {project.customer?.name || "Bilinmiyor"} 
                          </span>
                        </div>
                        
                        {project.location && (
                          <p className="text-xs text-gray-500 mb-2 font-medium flex items-center">
                            📍 {project.location}
                          </p>
                        )}
                        
                        <p className="text-sm text-gray-600 mb-4">{project.description}</p>
                        
                        <div className="mb-4">
                          <div className="flex justify-between text-xs font-bold text-gray-600 mb-1.5">
                            <span>Tamamlanma Durumu</span>
                            <span className="text-blue-600">%{project.progress}</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2.5">
                            <div className="bg-[#02529C] h-2.5 rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }}></div>
                          </div>
                        </div>

                        <div className="flex justify-end border-t border-gray-100 pt-3 mt-1">
                         <button 
                            onClick={() => handleNotify(project.id)}
                            disabled={sendingEmailId === project.id}
                            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${
                              sendingEmailId === project.id 
                                ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                                : 'text-green-700 bg-green-50 hover:bg-green-100'
                            }`}
                          >
                            <Send className={`w-4 h-4 ${sendingEmailId === project.id ? 'animate-pulse' : ''}`} /> 
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
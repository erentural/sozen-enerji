"use client";

import { useState, useEffect } from "react";
import { Package, Plus, Image as ImageIcon, Trash2, Edit2, X } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State'i (Ekleme ve Düzenleme için ortak kullanılacak)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: ""
  });

  // Düzenleme Modu State'i
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Ürünler çekilemedi", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Düzenleme Modunu Başlat
  const handleEditClick = (product) => {
    setEditingId(product.id);
    setFormData({
      title: product.name, // <--- SADECE BURAYI product.name OLARAK DEĞİŞTİRDİK
      description: product.description,
      price: product.price.toString(),
      imageUrl: product.imageUrl || ""
    });
  };

  // Düzenleme Modunu İptal Et
  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", price: "", imageUrl: "" });
  };

  // Formu Gönder (Ekle veya Güncelle)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Eğer editingId varsa PATCH (Güncelleme), yoksa POST (Yeni Ekleme) yap
      const url = editingId ? `/api/admin/products/${editingId}` : "/api/admin/products";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        cancelEdit(); // Formu temizle ve modu sıfırla
        fetchProducts(); // Listeyi yenile
      }
    } catch (error) {
      console.error("İşlem başarısız", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Ürünü Sil
  const handleDelete = async (id) => {
    if (!window.confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
        // Eğer silinen ürün şu an düzenleniyorsa, formu da temizle
        if (editingId === id) cancelEdit();
      }
    } catch (error) {
      console.error("Ürün silinemedi", error);
    }
  };

  if (loading) return <div className="p-8 text-gray-500 font-medium">Ürünler yükleniyor...</div>;

  return (
    <div className="p-8 max-w-7xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Ürün Yönetimi</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sol Kolon: Form */}
        <div className="lg:col-span-1">
          <div className={`bg-white rounded-xl shadow-sm border p-6 sticky top-8 transition-colors ${editingId ? 'border-[#02529C] ring-1 ring-[#02529C]' : 'border-gray-200'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-lg font-bold flex items-center ${editingId ? 'text-[#02529C]' : 'text-gray-900'}`}>
                {editingId ? <Edit2 className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
                {editingId ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
              </h2>
              {editingId && (
                <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-700" title="İptal Et">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Ürün Adı</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Örn: 400W Güneş Paneli" className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Açıklama</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="3" placeholder="Ürün özelliklerini giriniz..." className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-blue-500" required></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Fiyat (TL)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Örn: 4500" className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Ürün Görseli (URL)</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-gray-200 bg-gray-50 text-gray-500 rounded-l"><ImageIcon className="w-4 h-4" /></span>
                  <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://..." className="flex-1 px-3 py-2 border border-gray-200 rounded-r focus:outline-none focus:border-blue-500" />
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className={`w-full text-white font-bold py-3 rounded transition-colors disabled:opacity-70 mt-2 ${editingId ? 'bg-[#02529C] hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'}`}>
                {isSubmitting ? "Kaydediliyor..." : editingId ? "Değişiklikleri Kaydet" : "Ürünü Ekle"}
              </button>
            </form>
          </div>
        </div>

        {/* Sağ Kolon: Ürün Listesi */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <Package className="w-5 h-5 mr-2 text-blue-600" /> Mevcut Ürünler
            </h2>

            {products.length === 0 ? (
              <p className="text-gray-500 text-sm py-10 text-center border-2 border-dashed rounded-xl">Henüz hiç ürün eklenmemiş.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product) => (
                  <div key={product.id} className={`flex border rounded-lg overflow-hidden group transition-all ${editingId === product.id ? 'border-[#02529C] bg-blue-50/30 ring-1 ring-[#02529C]' : 'border-gray-100 hover:border-blue-200'}`}>
                    <div className="w-24 shrink-0 bg-gray-100 flex items-center justify-center">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-8 h-8 text-gray-300" />
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                       <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{product.name}</h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                      </div>
                      <div className="mt-3 flex justify-between items-center">
                        <span className="font-bold text-blue-600">{product.price} ₺</span>
                        
                        {/* Düzenle ve Sil Butonları */}
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEditClick(product)}
                            className="p-1.5 text-gray-400 hover:text-[#02529C] hover:bg-blue-50 rounded"
                            title="Düzenle"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Sil"
                          >
                            <Trash2 className="w-4 h-4" />
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
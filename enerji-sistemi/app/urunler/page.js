"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Package } from "lucide-react";

export default function PublicProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-blue-950 mb-4">Ürün Kataloğumuz</h1>
          <p className="text-gray-600 max-w-2xl mx-auto italic">
            Projelerimizde kullandığımız son teknoloji enerji ekipmanlarını inceleyin.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Ürünler listeleniyor...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                
                {/* GÜNCELLENEN GÖRSEL ALANI */}
                <div className="h-52 bg-gray-50 flex items-center justify-center overflow-hidden border-b border-gray-100">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <Package className="w-10 h-10" />
                      <span className="text-xs">Görsel Yok</span>
                    </div>
                  )}
                </div>

                <div className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-3 h-12">{product.description}</p>
                  <div className="flex justify-between items-center border-t pt-6">
                    <span className="text-2xl font-black text-blue-600">
                      {product.price ? `${product.price} ₺` : "Fiyat Sorunuz"}
                    </span>
                    <button className="bg-blue-50 text-blue-600 font-bold text-sm px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors"> Detaylar </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
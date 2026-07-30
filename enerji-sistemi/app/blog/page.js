import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CalendarDays, ArrowRight, ArrowLeft, Eye, Zap, Flame, User } from "lucide-react";

// Google SEO için Meta Etiketleri
export const metadata = {
  title: 'Blog ve Haberler | Sözen Enerji',
  description: 'Yenilenebilir enerji sistemleri, güneş paneli teşvikleri ve şirketimizden en güncel haberler.',
};

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  // Veritabanından sadece "Yayınlanmış" (published: true) olan yazıları çek
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' }
  });

  // En son eklenen yazıyı "Manşet (Öne Çıkan)" yapıyoruz, diğerlerini grid içinde listeliyoruz
  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 transition-colors duration-300 font-sans">
      
      {/* 1. PREMIUM HERO (TEPE) BÖLÜMÜ */}
      <div className="relative bg-[#02529C] dark:bg-slate-900 overflow-hidden border-b-[6px] border-[#FFC107]">
        
        {/* Arka plan dekoratif parlamaları */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[150%] rounded-full bg-gradient-to-b from-[#FFC107]/20 to-transparent blur-3xl mix-blend-overlay transition-all duration-1000"></div>
          <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[100%] rounded-full bg-gradient-to-t from-blue-400/20 to-transparent blur-3xl mix-blend-overlay"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-32 relative z-10">
          
          {/* Geri Dön Butonu - Cam Efekti (Glassmorphism) */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-xl text-sm font-bold text-white hover:shadow-xl transition-all duration-300 group mb-12"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            Ana Sayfaya Dön
          </Link>

          {/* Başlık Alanı */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFC107] text-slate-900 text-xs font-black tracking-widest uppercase mb-6 shadow-lg shadow-[#FFC107]/20">
              <Zap className="w-4 h-4" /> BİLGİ MERKEZİ
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
              Sektörel Haberler <br className="hidden md:block" />
              <span className="text-[#FFC107]">& Duyurular</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 dark:text-slate-300 font-medium max-w-2xl leading-relaxed">
              Güneş enerjisi teknolojileri, güncel devlet teşvikleri ve tamamladığımız dev projeler hakkında en son gelişmeleri takip edin.
            </p>
          </div>
        </div>
      </div>

      {/* 2. İÇERİK BÖLÜMÜ (Negatif margin ile hero'nun üstüne bindiriyoruz) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        
        {posts.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-10 h-10 text-slate-400" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xl font-bold">Henüz yayınlanmış bir yazı bulunmuyor.</p>
            <p className="text-slate-400 mt-2">Çok yakında güncel içeriklerle buradayız!</p>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* MANŞET (ÖNE ÇIKAN HABER) - Sadece en son eklenen haber burada dev gibi çıkar */}
            {featuredPost && (
              <Link href={`/blog/${featuredPost.slug}`} className="group block bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-xl border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-[#02529C]/10 transition-all duration-500">
                <div className="flex flex-col lg:flex-row">
                  <div className="lg:w-3/5 h-72 lg:h-[450px] relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                    {featuredPost.imageUrl ? (
                      <img src={featuredPost.imageUrl} alt={featuredPost.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-[#02529C] opacity-10 font-black text-6xl tracking-tighter">SÖZEN</div>
                    )}
                    <div className="absolute top-6 left-6 bg-red-500 text-white text-xs font-black px-4 py-2 rounded-lg shadow-lg flex items-center gap-1.5 uppercase tracking-wider animate-pulse">
                      <Flame className="w-4 h-4" /> En Yeni
                    </div>
                  </div>
                  
                  <div className="lg:w-2/5 p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-500 dark:text-slate-400 mb-6">
                      <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-md"><CalendarDays className="w-4 h-4 text-[#02529C] dark:text-blue-500" /> {new Date(featuredPost.createdAt).toLocaleDateString('tr-TR')}</span>
                      <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-md"><Eye className="w-4 h-4 text-emerald-500" /> {featuredPost.viewCount} Okunma</span>
                    </div>
                    
                    <h2 className="text-2xl lg:text-4xl font-black text-slate-900 dark:text-white mb-4 line-clamp-3 group-hover:text-[#02529C] dark:group-hover:text-blue-400 transition-colors leading-tight">
                      {featuredPost.title}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-base font-medium line-clamp-3 mb-8">
                      {featuredPost.summary}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-full bg-[#02529C]/10 dark:bg-blue-500/20 flex items-center justify-center text-[#02529C] dark:text-blue-400"><User className="w-4 h-4" /></div>
                         <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{featuredPost.author || "Sözen Enerji"}</span>
                      </div>
                      <span className="flex items-center gap-2 px-5 py-2.5 bg-[#02529C] text-white text-sm font-bold rounded-xl group-hover:bg-[#FFC107] group-hover:text-slate-900 transition-colors shadow-md">
                        Okumaya Başla <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* DİĞER HABERLER GRİDİ */}
            {otherPosts.length > 0 && (
              <div className="pt-8">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8 border-l-4 border-[#FFC107] pl-4">Önceki Haberler</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {otherPosts.map((post) => (
                    <Link href={`/blog/${post.slug}`} key={post.id} className="group flex flex-col bg-white dark:bg-slate-900 rounded-[1.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-[#02529C]/5 transition-all duration-500 hover:-translate-y-2">
                      
                      {/* Kart Fotoğrafı */}
                      <div className="h-56 overflow-hidden bg-slate-200 dark:bg-slate-800 relative">
                        {post.imageUrl ? (
                          <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-[#02529C] opacity-20 font-black text-3xl tracking-widest">SÖZEN</div>
                        )}
                      </div>

                      {/* Kart İçeriği */}
                      <div className="p-6 sm:p-8 flex-1 flex flex-col relative">
                        {/* Tarih Etiketi (Yukarıdan Taşmalı) */}
                        <div className="absolute -top-5 left-6 bg-white dark:bg-slate-800 px-4 py-1.5 rounded-lg text-xs font-bold text-[#02529C] dark:text-blue-400 shadow-md border border-slate-100 dark:border-slate-700 flex items-center gap-1.5">
                          <CalendarDays className="w-3.5 h-3.5" />
                          {new Date(post.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>

                        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-3 mt-2 line-clamp-2 group-hover:text-[#02529C] dark:group-hover:text-blue-400 transition-colors leading-tight">
                          {post.title}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium line-clamp-3 mb-6 flex-1">
                          {post.summary}
                        </p>
                        
                        <div className="flex items-center justify-between mt-auto pt-5 border-t border-slate-100 dark:border-slate-800">
                          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-slate-500">
                            <Eye className="w-4 h-4" /> {post.viewCount} Okunma
                          </span>
                          <span className="flex items-center gap-1 text-sm font-bold text-[#02529C] dark:text-blue-500 group-hover:text-[#FFC107] transition-colors">
                            Devamını Oku <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
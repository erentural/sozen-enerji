import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CalendarDays, ArrowRight, Eye, Zap } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Üst Başlık Alanı */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-bold tracking-widest uppercase mb-6">
            <Zap className="w-4 h-4" /> BİLGİ MERKEZİ
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
            Sektörel Haberler & <span className="text-blue-600 dark:text-blue-500">Duyurular</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
            Güneş enerjisi teknolojileri, güncel devlet teşvikleri ve tamamladığımız dev projeler hakkında en son gelişmeleri takip edin.
          </p>
        </div>

        {/* Yazıların Listelendiği Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">Henüz yayınlanmış bir yazı bulunmuyor. Çok yakında buradayız!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.id} className="group flex flex-col bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                
                {/* Kapak Fotoğrafı */}
                <div className="h-56 overflow-hidden bg-slate-200 dark:bg-slate-800 relative">
                  {post.imageUrl ? (
                    <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400 font-bold opacity-30 text-2xl">SÖZEN ENERJİ</div>
                  )}
                  <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-slate-900 dark:text-white shadow-sm flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {new Date(post.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>

                {/* İçerik */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm font-medium line-clamp-3 mb-6 flex-1">
                    {post.summary}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-5 border-t border-slate-100 dark:border-slate-800">
                    <span className="flex items-center gap-1 text-xs font-bold text-slate-400 dark:text-slate-500">
                      <Eye className="w-4 h-4" /> {post.viewCount} Okunma
                    </span>
                    <span className="flex items-center gap-1 text-sm font-bold text-blue-600 dark:text-blue-500 group-hover:gap-2 transition-all">
                      Devamını Oku <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
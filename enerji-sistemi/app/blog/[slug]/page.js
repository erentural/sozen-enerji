import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CalendarDays, ArrowLeft, Eye, Share2 } from "lucide-react";

// Vercel'in sayfayı yanlış önbelleğe (cache) alıp çökmesini engeller
export const dynamic = 'force-dynamic';

// Dinamik SEO Meta Etiketleri
export async function generateMetadata({ params }) {
  // Next.js kuralı: URL parametrelerinin yüklenmesini "await" ile bekliyoruz
  const resolvedParams = await params;
  
  try {
    const post = await prisma.blogPost.findUnique({ 
      where: { slug: resolvedParams.slug } 
    });
    if (!post) return { title: 'Yazı Bulunamadı' };
    
    return {
      title: `${post.title} | Sözen Enerji`,
      description: post.summary || 'Sözen Enerji blog yazısı.',
    };
  } catch (error) {
    return { title: 'Sözen Enerji' };
  }
}

export default async function BlogPostPage({ params }) {
  // Sayfa yüklenirken de parametrenin tam gelmesini bekliyoruz
  const resolvedParams = await params;

  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug: resolvedParams.slug }
    });

    if (!post || !post.published) {
      notFound();
    }

    // Okunma sayısını artır
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } }
    });

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-20 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Geri Dön Butonu */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Tüm Yazılara Dön
          </Link>

          {/* Yazı Başlığı ve Bilgiler */}
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400">
              <CalendarDays className="w-4 h-4 text-blue-600 dark:text-blue-500" />
              {new Date(post.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400">
              <Eye className="w-4 h-4 text-emerald-500" />
              {post.viewCount} Görüntülenme
            </div>
          </div>

          {/* Kapak Fotoğrafı */}
          {post.imageUrl && (
            <div className="mb-12 rounded-3xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800">
              <img src={post.imageUrl} alt={post.title} className="w-full object-cover max-h-[500px]" />
            </div>
          )}

          {/* Yazı İçeriği */}
          <article className="prose prose-lg dark:prose-invert prose-blue max-w-none mb-16">
            {(post.content || "").split('\n').map((paragraph, index) => (
              paragraph.trim() !== "" ? <p key={index} className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6 font-medium text-[17px]">{paragraph}</p> : <br key={index} />
            ))}
          </article>

          {/* Yazı Altı Paylaşım ve Etiket Alanı */}
          <div className="flex items-center justify-between py-6 border-t border-slate-200 dark:border-slate-800">
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Yazar: {post.author || "Sözen Enerji"}</span>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-sm rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
              <Share2 className="w-4 h-4" /> Yazıyı Paylaş
            </button>
          </div>

        </div>
      </div>
    );
  } catch (error) {
    console.error("Blog detay hatası:", error);
    notFound(); // Olası bir sistem çökmesinde beyaz sayfa yerine 404 sayfası gösterir
  }
}
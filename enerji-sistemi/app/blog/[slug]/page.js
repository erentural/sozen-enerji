import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CalendarDays, ArrowLeft, Eye, Zap, User } from "lucide-react";
import ShareButton from "@/components/ShareButton"; 

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  try {
    const post = await prisma.blogPost.findUnique({ where: { slug: resolvedParams.slug } });
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors duration-300 font-sans">
        
        {/* PREMIUM HERO (TEPE) BÖLÜMÜ */}
        <div className="bg-[#02529C] dark:bg-slate-900 pt-12 pb-40 border-b-[6px] border-[#FFC107] relative overflow-hidden">
          
          {/* Dekoratif Parlama */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-gradient-to-bl from-blue-400/20 to-transparent blur-3xl"></div>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
            
            {/* Geri Dön Butonu (Cam Efekti) */}
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-sm font-bold text-white transition-all duration-300 group mb-8 shadow-lg"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Tüm Yazılara Dön
            </Link>

            {/* Etiketler ve Tarih */}
            <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-[#FFC107] text-slate-900 text-xs font-black rounded-md tracking-wide uppercase">
                <Zap className="w-3.5 h-3.5" /> Haber
              </span>
              <span className="flex items-center gap-1.5 text-sm font-bold text-blue-200">
                <CalendarDays className="w-4 h-4" /> {new Date(post.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1.5 text-sm font-bold text-blue-200">
                <Eye className="w-4 h-4 text-emerald-400" /> {post.viewCount} Okunma
              </span>
            </div>

            {/* Yazı Başlığı */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-8 leading-tight tracking-tight">
              {post.title}
            </h1>

            {/* Yazar Bilgisi (Dinamik) */}
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm border border-white/30">
                 <User className="w-5 h-5" />
               </div>
               <div className="text-left">
                 <p className="text-xs font-medium text-blue-200">Yazar</p>
                 <p className="text-sm font-bold text-white">{post.author || "Sözen Enerji"}</p>
               </div>
            </div>

          </div>
        </div>

        {/* İÇERİK BÖLÜMÜ (Yukarıya Bindirilmiş) */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
          
          {/* Kapak Fotoğrafı */}
          <div className="bg-white dark:bg-slate-900 p-2 sm:p-3 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 mb-12">
            <div className="rounded-[1.5rem] overflow-hidden bg-slate-100 dark:bg-slate-800 relative aspect-video">
              {post.imageUrl ? (
                <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-[#02529C] font-black opacity-10 text-6xl tracking-widest">SÖZEN</div>
              )}
            </div>
          </div>

          {/* Yazı Metni (Geniş Okuma Alanı) */}
          <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800 mb-12">
            <article className="prose prose-lg sm:prose-xl dark:prose-invert prose-blue max-w-none prose-headings:font-black prose-p:font-medium prose-p:text-slate-700 dark:prose-p:text-slate-300 leading-relaxed">
              {(post.content || "").split('\n').map((paragraph, index) => (
                paragraph.trim() !== "" ? <p key={index}>{paragraph}</p> : <br key={index} />
              ))}
            </article>

            {/* YAZARI GÖSTER VE YAZIYI PAYLAŞ ALANI */}
            <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
              
              {/* Sol: Yazar Kartı */}
              <div className="flex items-center gap-4">
                 <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#02529C] dark:text-blue-400">
                   <User className="w-7 h-7" />
                 </div>
                 <div>
                   <p className="text-sm font-medium text-slate-500">Bu yazıyı hazırlayan:</p>
                   <p className="text-lg font-black text-slate-900 dark:text-white">{post.author || "Sözen Enerji"}</p>
                 </div>
              </div>
              
              {/* Sağ: Yeni İnteraktif Paylaşım Butonu */}
              <ShareButton title={post.title} />

            </div>
          </div>

        </div>
      </div>
    );
  } catch (error) {
    console.error("Blog detay hatası:", error);
    notFound();
  }
}
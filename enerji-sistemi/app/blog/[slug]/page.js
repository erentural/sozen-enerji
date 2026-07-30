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

    await prisma.blogPost.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } }
    });

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 transition-colors duration-300 font-sans">
        
        {/* PREMIUM HERO (TEPE) BÖLÜMÜ */}
        <div className="bg-[#02529C] dark:bg-slate-900 pt-12 pb-56 border-b-[6px] border-[#FFC107] relative overflow-hidden">
          
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-gradient-to-bl from-blue-400/20 to-transparent blur-3xl"></div>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
            
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-sm font-bold text-white transition-all duration-300 group mb-10 shadow-lg"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Tüm Yazılara Dön
            </Link>

            <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-[#FFC107] text-slate-900 text-xs font-black rounded-md tracking-wide uppercase shadow-md">
                <Zap className="w-3.5 h-3.5" /> Haber
              </span>
              <span className="flex items-center gap-1.5 text-sm font-bold text-blue-100 bg-black/20 px-3 py-1 rounded-md backdrop-blur-sm">
                <CalendarDays className="w-4 h-4" /> {new Date(post.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-300 bg-black/20 px-3 py-1 rounded-md backdrop-blur-sm">
                <Eye className="w-4 h-4" /> {post.viewCount} Okunma
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-8 leading-tight tracking-tight px-4">
              {post.title}
            </h1>

          </div>
        </div>

        {/* TEK PARÇA BÜTÜNLEŞİK MAKALE KARTI */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-36 relative z-20">
          
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            
            {/* Kapak Fotoğrafı (Kartın en üstüne sıfırlandı) */}
            {post.imageUrl ? (
              <div className="w-full aspect-video sm:aspect-[21/9] bg-slate-100 dark:bg-slate-800 relative border-b border-slate-100 dark:border-slate-800">
                <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-full h-40 bg-slate-50 dark:bg-slate-800 flex items-center justify-center border-b border-slate-100 dark:border-slate-800">
                <span className="text-[#02529C] font-black opacity-10 text-5xl tracking-widest">SÖZEN</span>
              </div>
            )}

            {/* İçerik Alanı */}
            <div className="p-8 sm:p-12 lg:p-16">
              
              {/* TAŞMA HATASINI ÇÖZEN KISIM (break-words sınıfı eklendi) */}
              <article className="prose prose-lg sm:prose-xl dark:prose-invert prose-blue max-w-none prose-headings:font-black prose-p:font-medium prose-p:text-slate-700 dark:prose-p:text-slate-300 leading-relaxed break-words">
                {(post.content || "").split('\n').map((paragraph, index) => (
                  paragraph.trim() !== "" ? <p key={index}>{paragraph}</p> : <br key={index} />
                ))}
              </article>

              {/* Alt Bilgi & Paylaşım Alanı */}
              <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
                
                {/* Yazar Bilgisi */}
                <div className="flex items-center gap-4">
                   <div className="w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-[#02529C] dark:text-blue-400 border border-slate-100 dark:border-slate-700 shadow-sm">
                     <User className="w-7 h-7" />
                   </div>
                   <div>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Bu yazıyı hazırlayan</p>
                     <p className="text-lg font-black text-slate-900 dark:text-white">{post.author || "Sözen Enerji"}</p>
                   </div>
                </div>
                
                {/* Paylaşım Butonları */}
                <ShareButton title={post.title} />

              </div>
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
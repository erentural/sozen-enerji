import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'
import { ThemeProvider } from '@/components/ThemeProvider'
import { SpeedInsights } from "@vercel/speed-insights/next"
import WhatsAppButton from "@/components/WhatsAppButton";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Enerji Sistemi',
  description: 'Enerji Takip ve Yönetim Sistemi',
}

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning BURADA OLMALI!
    <html lang="tr" suppressHydrationWarning> 
      <head>
        {/* Karanlık Mod Parlama Önleyici Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
        {/* Doğru HTML yapısı için body'den head içerisine alındı */}
        <meta name="google-site-verification" content="Sp24FlwX9QmeamUO1MPQId3BZovoM4-oh8m0Lg7Y9VI" />
      </head>
      <body className={`${inter.className} bg-white dark:bg-gray-950 transition-colors duration-300`}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </AuthProvider>
        
        {/* VERCEL SPEED INSIGHTS BİLEŞENİ BURAYA EKLENDİ */}
        <SpeedInsights />
        
        {/* YENİ EKLENEN: WHATSAPP CANLI DESTEK BUTONU */}
        <WhatsAppButton />
      </body>
    </html>
  )
}
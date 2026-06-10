import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'
import { ThemeProvider } from '@/components/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })


export const metadata = {
  title: 'Enerji Sistemi',
  description: 'Enerji Takip ve Yönetim Sistemi',
}

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning BURADA OLMALI!
    <html lang="tr" suppressHydrationWarning> 
      <body className={`${inter.className} bg-white dark:bg-gray-950 transition-colors duration-300`}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
<meta name="google-site-verification" content="google82f69a2eaed749c8.html" />

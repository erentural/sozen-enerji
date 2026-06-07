import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth" // Bir önceki adımda oluşturduğumuz ayar dosyası

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
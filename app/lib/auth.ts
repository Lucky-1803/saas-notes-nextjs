import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { User } from "@/app/models/User"
import { connectDB } from "@/app/lib/db"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        await connectDB()
        const user = await User.findOne({ email: credentials.email })

        if (!user || !user.password) return null
        if (!user.providers.includes("credentials")) return null

        const isMatch = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isMatch) return null

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: { prompt: "select_account" },
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) return false

        await connectDB()
        const existingUser = await User.findOne({ email: user.email })

        if (!existingUser) {
          const newUser = await User.create({
            name: user.name ?? "",
            email: user.email,
            providers: ["google"],
          })
          user.id = newUser._id.toString()
        } else {
          if (!existingUser.providers.includes("google")) {
            existingUser.providers.push("google")
            await existingUser.save()
          }
          user.id = existingUser._id.toString()
        }
      }
      return true
    },

    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },

  session: { strategy: "jwt" },

  secret: process.env.NEXTAUTH_SECRET as string,
}

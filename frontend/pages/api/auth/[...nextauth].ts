import NextAuth, {Session, User} from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const googleClientId = process.env.GOOGLE_CLIENT_ID !== undefined ?process.env.GOOGLE_CLIENT_ID:""
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET !== undefined ?process.env.GOOGLE_CLIENT_SECRET:""
const facebookClientId = process.env.FACEBOOK_CLIENT_ID !== undefined ?process.env.FACEBOOK_CLIENT_ID:""
const facebookClientSecret = process.env.FACEBOOK_CLIENT_SECRET !== undefined ?process.env.FACEBOOK_CLIENT_SECRET:""
const JWTSecret = process.env.JWT_SECRET !== undefined ? process.env.JWT_SECRET: ""
const prisma = new PrismaClient()

interface SessionProps {
  user: User,
  session:Session,
  token: any
}
export default NextAuth({
 // Configure one or more authentication providers
 adapter: PrismaAdapter(prisma),
 providers: [
    GoogleProvider({
    clientId: googleClientId,
    clientSecret: googleClientSecret
   }),
   FacebookProvider({
    clientId: facebookClientId,
    clientSecret: facebookClientSecret
  })
   // ...add more providers here
 ],
 pages: {
  signIn: '/',
  signOut: '/auth/signout',
  error: '/auth/error', // Error code passed in query string as ?error=
  verifyRequest: '/auth/verify-request', // (used for check email message)
  newUser: '/products' // New users will be directed here on first sign in (leave the property out if not of interest)
},
callbacks: {
  async session({ session, user}:SessionProps) {
    if (session !== undefined) {  
      session.id = user.id
      console.log(session)
    }
    return Promise.resolve(session)
  },
  async signIn({ user, account, profile, email, credentials }) {
    return true
  }

},
secret: JWTSecret,
jwt: {
  // A secret to use for key generation. Defaults to the top-level `secret`.
  secret: JWTSecret,
  // The maximum age of the NextAuth.js issued JWT in seconds.
  // Defaults to `session.maxAge`.
  maxAge: 60 * 60 * 24 * 30,
}
})
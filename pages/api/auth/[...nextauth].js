import CredentialsProvider from "next-auth/providers/credentials"
import NextAuth from "next-auth"
import axios from "axios"

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Authentication",
      credentials: {
        address: {
          label: "Address",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials) {
        try {
          const { address, signature } = credentials
          const result = await axios.post(
            `${process.env.BACKEND_URL}/users/verifySignature`,
            {
              address,
              signature,
            }
          )
          const accessToken = result.data.accessToken
          console.log(accessToken)
          const user = { address, accessToken, signature }
          return user
        } catch (e) {
          console.error(e)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      user && (token.user = user)
      return token
    },
    async session({ session, token }) {
      session.user = token.user
      return session
    },
  },
})

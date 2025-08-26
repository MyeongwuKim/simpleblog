import { NextAuthOptions } from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";

const redirectUrl = `${process.env.NEXTAUTH_URL}/api/auth/callback/kakao`;
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    KakaoProvider({
      clientId: "e812765b10463e95251555cb9a69a6e7",
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
      authorization: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=e812765b10463e95251555cb9a69a6e7&redirect_uri=${redirectUrl}&prompt=login`,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    jwt: ({ token, user }) => {
      return { ...token, ...user };
    },
    signIn: async (params) => {
      const { email } = params.user;

      if (email == "mw1992@naver.com") {
        return true;
      } else return false;
    },
  },
};

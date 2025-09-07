import { NextAuthOptions } from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import CredentialsProvider from "next-auth/providers/credentials";

const redirectUrl = `${process.env.NEXTAUTH_URL}/api/auth/callback/kakao`;
const isDemo = process.env.NEXT_PUBLIC_DEMO === "true";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    ...(isDemo
      ? [
          CredentialsProvider({
            name: "DemoLogin",
            credentials: {},
            async authorize() {
              // ✅ 데모 계정 바로 리턴
              return {
                id: "demo-user",
                name: "데모 유저",
                email: "demo@example.com",
                image: "https://picsum.photos/seed/demo/200/200",
              };
            },
          }),
        ]
      : [
          KakaoProvider({
            clientId: "e812765b10463e95251555cb9a69a6e7",
            clientSecret: process.env.KAKAO_CLIENT_SECRET!,
            authorization: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=e812765b10463e95251555cb9a69a6e7&redirect_uri=${redirectUrl}&prompt=login`,
          }),
        ]),
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

      if (isDemo) {
        // 데모 모드에서는 누구나 허용
        return true;
      }
      if (email === "mw1992@naver.com") {
        return true;
      }

      return false;
    },
  },
};

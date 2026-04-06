import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const getSessionOrNull = async (req: NextRequest) =>
  getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET ?? process.env.SECRET,
  });

const getStreamHeaders = () => ({
  Authorization: `Bearer ${process.env.CF_VIDEO_TOKEN}`,
  "Content-Type": "application/json",
});

export const POST = async (req: NextRequest) => {
  const session = await getSessionOrNull(req);

  if (!session) {
    return NextResponse.json(
      { ok: false, error: "로그인 인증이 필요합니다." },
      { status: 401 }
    );
  }

  if (!process.env.CF_ACCOUNT || !process.env.CF_VIDEO_TOKEN) {
    return NextResponse.json(
      { ok: false, error: "비디오 업로드 설정이 누락되었습니다." },
      { status: 500 }
    );
  }

  try {
    const fetchUrl = `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT}/stream/direct_upload`;

    const cfRes = await fetch(fetchUrl, {
      method: "POST",
      headers: getStreamHeaders(),
      body: JSON.stringify({ maxDurationSeconds: 3600 }),
    });

    const response = await cfRes.json();

    if (!cfRes.ok || !response?.success || !response?.result) {
      const message =
        response?.errors?.[0]?.message ??
        "비디오 업로드 URL 생성에 실패하였습니다.";
      return NextResponse.json({ ok: false, error: message }, { status: 502 });
    }

    return NextResponse.json({
      ok: true,
      ...response.result,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "비디오 서버와 통신중 오류가 발생하였습니다.",
      },
      { status: 500 }
    );
  }
};

export const GET = async (req: NextRequest) => {
  const session = await getSessionOrNull(req);
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "로그인 인증이 필요합니다." },
      { status: 401 }
    );
  }

  if (!process.env.CF_ACCOUNT || !process.env.CF_VIDEO_TOKEN) {
    return NextResponse.json(
      { ok: false, error: "비디오 업로드 설정이 누락되었습니다." },
      { status: 500 }
    );
  }

  const uid = req.nextUrl.searchParams.get("uid");
  if (!uid) {
    return NextResponse.json(
      { ok: false, error: "uid가 필요합니다." },
      { status: 400 }
    );
  }

  try {
    const fetchUrl = `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT}/stream/${uid}`;
    const cfRes = await fetch(fetchUrl, {
      method: "GET",
      headers: getStreamHeaders(),
      cache: "no-store",
    });

    const response = await cfRes.json();
    if (!cfRes.ok || !response?.success || !response?.result) {
      const message =
        response?.errors?.[0]?.message ?? "비디오 상태 조회에 실패하였습니다.";
      return NextResponse.json({ ok: false, error: message }, { status: 502 });
    }

    return NextResponse.json({
      ok: true,
      uid: response.result.uid,
      readyToStream: Boolean(response.result.readyToStream),
      status: response.result.status?.state ?? null,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "비디오 서버와 통신중 오류가 발생하였습니다.",
      },
      { status: 500 }
    );
  }
};

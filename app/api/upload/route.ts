import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const fetchUrl = `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT}/images/v1/direct_upload`;
    const response = await (
      await fetch(fetchUrl, {
        method: req.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CF_TOKEN}`,
        },
      })
    ).json();
    return NextResponse.json({
      ok: true,
      ...response.result,
    });
  } catch {
    return NextResponse.json({
      ok: false,
      error: "이미지 서버와 통신중 오류가 발생하였습니다.",
    });
  }
};

export const DELETE = async (req: NextRequest) => {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { ok: false, error: "id required" },
      { status: 400 }
    );
  }

  try {
    fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT}/images/v1/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.CF_TOKEN}`,
        },
      }
    );
    return NextResponse.json({
      ok: true,
    });
  } catch (e: unknown) {
    if (e instanceof Error) {
      return NextResponse.json(
        { ok: false, error: e.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { ok: false, error: "Unknown error" },
      { status: 500 }
    );
  }
};
// async function handler(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     let response;
//     let fetchUrl = `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT}/images/v1/direct_upload`;

//     if (req.method == "DELETE") {
//       let { imageId } = JSON.parse(req.body);
//       fetchUrl = `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT}/images/v1/${imageId}`;
//     }
//     response = await (
//       await fetch(fetchUrl, {
//         method: req.method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${process.env.CF_TOKEN}`,
//         },
//       })
//     ).json();

//     res.json({
//       ok: true,
//       ...response.result,
//     });
//   } catch {
//     res.json({
//       ok: false,
//       error: "이미지 서버와 통신중 오류가 발생하였습니다.",
//     });
//   }
// }

import { rest } from "msw";

export const handlers = [
  //태그 자동완성 api
  rest.get("/api/tag/search", (req, res, ctx) => {
    const q = req.url.searchParams.get("q");

    return res(
      ctx.status(200),
      ctx.json({
        data: [{ body: `${q}1` }, { body: `${q}2` }],
      })
    );
  }),
];

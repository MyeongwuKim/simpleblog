import { rest } from "msw";

export const handlers = [
  rest.get("https://example.com/api/data", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 1,
        title: "MSW 테스트 데이터",
        completed: true,
      })
    );
  }),
  rest.get("https://example.com/api/user", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        name: "김철수",
      })
    );
  }),
];

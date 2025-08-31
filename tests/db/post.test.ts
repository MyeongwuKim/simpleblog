import { prisma } from "../../jest.setup"; // ← 이걸로

describe("Post 생성", () => {
  it("Post를 생성하고 조회한다", async () => {
    // 1) Tag 하나 생성
    const tag = await prisma.tag.create({
      data: { body: "테스트태그" },
    });

    // 2) Post 생성 (tag 연결)
    const post = await prisma.post.create({
      data: {
        title: "테스트 제목",
        content: "테스트 본문",
        preview: "미리보기 텍스트",
        thumbnail: "https://example.com/thumb.png",
        slug: "test-slug",
        tagIds: [tag.id], // MongoDB는 ObjectId[]
        imageIds: ["img123", "img456"],
        isTemp: false,
      },
    });

    // 3) Post + Tag 확인
    const found = await prisma.post.findUnique({
      where: { id: post.id },
      include: { tag: true },
    });

    expect(found).not.toBeNull();
    expect(found?.title).toBe("테스트 제목");
    expect(found?.tag[0].body).toBe("테스트태그");
  });
});

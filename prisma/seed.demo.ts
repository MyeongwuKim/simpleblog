// prisma/seed.demo.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  for (let i = 1; i <= 50; i++) {
    const isTemp = false; // 데모니까 전부 false, 필요하면 i%5 === 0 ? true : false 이런 식으로 랜덤 지정 가능

    // 트랜잭션으로 Post + Tag upsert
    await prisma.$transaction(async (tx) => {
      const post = await tx.post.create({
        data: {
          title: `데모 포스트 #${i}`,
          content: `
# 데모 포스트 #${i}

안녕하세요 👋  
이 글은 **데모용 마크다운 포스트**입니다. 실제 블로그 글처럼 보이도록 샘플 텍스트와 이미지를 포함했습니다.

---

## 소개
이 포스트는 Prisma 시드를 이용해 자동 생성되었습니다.  
마크다운으로 작성되었기 때문에 **헤딩, 코드블록, 이미지, 리스트** 등을 지원합니다.

## 주요 내용
1. 간단한 목차를 만들 수 있습니다.
2. **굵은 글씨**와 *기울임*을 쓸 수 있습니다.
3. 인용문도 가능합니다:

> "어제보다 나은 코드, 오늘보다 나은 나."

---

## 예시 코드

\`\`\`tsx
function DemoPost() {
  return <div>데모 포스트 #{i}</div>;
}
\`\`\`

---

## 이미지
아래는 랜덤 샘플 이미지입니다 (picsum.photos).

![샘플 이미지 1](https://picsum.photos/seed/${i}a/600/400)
![샘플 이미지 2](https://picsum.photos/seed/${i}b/600/400)

---

## 결론
이 포스트는 데모용 데이터이지만, 실제 마크다운 렌더링 결과를 확인하는 데 유용합니다.
  `.trim(),
          preview: `이것은 데모 포스트 #${i}의 프리뷰 텍스트입니다.`,
          thumbnail: `https://picsum.photos/seed/${i}/400/300`,
          slug: `demo-post-${i}`,
          imageIds: [`img${i}a`, `img${i}b`], // 👉 필요하면 유지, 아니면 생략 가능
          isTemp,
        },
      });
      console.log(post);
      // 연결할 태그 body
      const body = ["nextjs", "react", "demo", "playground", "테스트"][i % 5];

      // 태그 upsert + post 연결
      await tx.tag.upsert({
        where: { body },
        create: {
          body,
          isTemp: post.isTemp, // 새로 생성될 땐 post.isTemp 따라감
          posts: {
            connect: { id: post.id },
          },
        },
        update: {
          // 이미 있으면 isTemp는 안 건드리고 posts만 연결
          posts: {
            connect: { id: post.id },
          },
        },
      });
    });
  }

  console.log("Demo seed 완료: Post 30개 + Tag 연결");

  // 데모 프로필 생성
  await prisma.profile.create({
    data: {
      title: "프론트엔드 개발자 김명우",
      content:
        "안녕하세요 👋 Next.js와 React로 웹을 만드는 프론트엔드 개발자입니다.\n데모 모드에서는 자유롭게 글쓰기, 태그, 이미지 업로드 등을 체험하실 수 있습니다.",
      introduce: "“어제보다 나은 코드, 오늘보다 나은 나”",
      profileImg: "https://picsum.photos/seed/profile/200/200",
      github: "https://github.com/MyeongwuKim",
      notion:
        "https://quilled-penalty-91a.notion.site/249bc37db9d6807a8dc4c0bfa353f1d5?pvs=74",
      instagram: "https://instagram.com/myeongwu",
    },
  });
  console.log("Demo seed 완료: Profile 생성");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });

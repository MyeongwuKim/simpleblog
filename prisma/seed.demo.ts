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
          imageIds: [],
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

  // 최근 7일 랜덤 날짜 생성
  function getRandomDateWithinDays(days: number) {
    const now = new Date();
    const past = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    return new Date(
      past.getTime() + Math.random() * (now.getTime() - past.getTime())
    );
  }
  const commentsSeed = [
    {
      name: "철수",
      content: "블로그 잘 보고 갑니다! Next.js 내용이 특히 유익했어요.",
      isMe: false,
    },
    {
      name: "영희",
      content: "TailwindCSS 설정법 정리해주신 게 도움이 됐습니다 👍",
      isMe: false,
    },
    {
      name: "민수",
      content: "Prisma랑 MongoDB 연동 예제가 깔끔하네요.",
      isMe: false,
    },
    {
      name: "지영",
      content: "리액트 쿼리 캐싱 설명이 이해 잘 됐어요!",
      isMe: false,
    },
    {
      name: "동현",
      content: "블로그 글이 정리가 잘 돼 있어서 자주 참고할 것 같아요.",
      isMe: false,
    },
    {
      name: "성민",
      content: "Jest 테스트 코드 예시 덕분에 바로 적용했어요.",
      isMe: false,
    },
    {
      name: "하늘",
      content: "UI/UX 디테일 설명이 깔끔해서 좋습니다.",
      isMe: false,
    },
    {
      name: "유진",
      content: "SSR/ISR 차이점 정리해주셔서 개념 잡는 데 도움됐습니다.",
      isMe: false,
    },
    {
      name: "지훈",
      content: "블로그 디자인도 예쁘고 글도 잘 읽혀요.",
      isMe: false,
    },
    {
      name: "서연",
      content: "React.memo 활용 글 덕분에 성능 최적화했습니다.",
      isMe: false,
    },
    {
      name: "태훈",
      content: "Hydration 관련 글이 진짜 유용했네요!",
      isMe: false,
    },
    {
      name: "나",
      content: "블로그 만들면서 배운 내용 공유합니다 😀",
      isMe: true,
    },
    {
      name: "현우",
      content: "MSW 테스트 환경 세팅법이 깔끔하네요.",
      isMe: false,
    },
    {
      name: "지수",
      content: "Infinite Scroll 구현 방법 잘 참고했습니다.",
      isMe: false,
    },
    {
      name: "민재",
      content: "NextAuth 로그인 처리 예제도 기대할게요!",
      isMe: false,
    },
    {
      name: "소영",
      content: "Tailwind 반응형 예시 보면서 따라했어요.",
      isMe: false,
    },
    {
      name: "준호",
      content: "코드 컨벤션 정리 덕분에 팀 프로젝트 적용했어요.",
      isMe: false,
    },
    {
      name: "혜진",
      content: "Skeleton UI 구현 글이 특히 좋았어요.",
      isMe: false,
    },
    {
      name: "나",
      content: "이 블로그는 제가 Next.js + Prisma로 직접 만든 프로젝트예요!",
      isMe: true,
    },
    {
      name: "가영",
      content: "MongoMemoryServer 테스트 환경 설명 최고네요.",
      isMe: false,
    },
    {
      name: "정우",
      content: "Next.js App Router 글이 큰 도움이 됐습니다.",
      isMe: false,
    },
    {
      name: "서진",
      content: "리액트 쿼리 staleTime vs gcTime 정리 좋네요.",
      isMe: false,
    },
    {
      name: "지아",
      content: "프로젝트 구조 설계 참고하기 좋습니다.",
      isMe: false,
    },
    {
      name: "민혁",
      content: "CI/CD 배포 팁 글 덕분에 에러 해결했어요.",
      isMe: false,
    },
    {
      name: "다은",
      content: "개발자 경험 기반으로 글 쓰신 게 느껴져요.",
      isMe: false,
    },
    {
      name: "나",
      content: "앞으로도 배운 내용들 꾸준히 기록할 예정입니다.",
      isMe: true,
    },
    {
      name: "현서",
      content: "Flowbite-React 컴포넌트 예시도 유용했어요.",
      isMe: false,
    },
    { name: "지완", content: "Prisma 에러 핸들링 정리 최고!", isMe: false },
    { name: "수빈", content: "면접 준비 글도 있으면 좋겠어요.", isMe: false },
    { name: "나", content: "읽어주셔서 감사합니다 🙏", isMe: true },
  ];
  for (const c of commentsSeed) {
    const created = await prisma.comment.create({
      data: {
        ...c,
        createdAt: getRandomDateWithinDays(7),
      },
    });
    console.log("생성된 댓글:", created);
  }
  console.log("Demo seed 완료: Comments 생성");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });

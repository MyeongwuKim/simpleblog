# SimpleBlog (1인개발)
> Next.js + Prisma + MongoDB 기반 개인 블로그 서비스  

🔗 **Deployment URL**  
👉 [https://simpleblog.vercel.app](https://simpleblog.vercel.app)  

---

## 📌 Summary
- velog를 기반으로 만든 사진 글을 작성/관리할 수 있는 개인 블로그 서비스  
- Next.js 14/15 기반으로 **App Router**와 **React Query v5** 학습 및 적용  
- **Infinite Scroll, Tag 필터, Skeleton UI** 등 UX 패턴 반영  
- Prisma + MongoDB를 사용해 **게시글, 태그, 댓글 모델링** 및 데이터 관리  
- **주요 기능**
  - react-markdown을 통한 글 작성 / 수정 / 삭제
  - 프로필 작성 및 수정
  - 임시 저장글 관리
  - 코멘트 작성 및 삭제
  - next-auth를 통한 oAuth 로그인 제공
  - 태그 등록 및 필터링
  - 무한 스크롤 및 로딩 스켈레톤

---

## Background
초창기에 Next.js 13을 학습하며 만들었던 블로그를 경험 삼아, 이번에는 Velog를 참고해 새롭게 제작했습니다.
이전 블로그는 UX/UI 측면에서 어색한 부분이 있었고, Next.js 버전도 오래되어 한계가 있었어요.
그래서 단순 CRUD를 넘어 실제 서비스에서 자주 사용되는 캐싱, 무한 스크롤, 태그 관리 같은 패턴을 적용하고,
React Query, Prisma, Jest 등 최신 기술들을 직접 실험해보는 공간으로 삼았습니다. 

---

## What I Learned
초창기에 아무 생각 없이 만들었던 블로그와 달리, 이번에는 성능 최적화와 렌더링 최소화에 집중했습니다.
useMemo, useCallback을 적극적으로 활용하고 React DevTools로 실제 렌더링 과정을 분석하며 불필요한 리렌더링을 줄이려 노력했습니다.

또한 Next.js의 대표 기능인 SSR, ISR, 캐시 무효화(revalidateTag) 등을 학습해 적용했고,
React Query와 Next.js의 캐싱 레이어가 어떻게 다르게 동작하는지 직접 비교 실험했습니다.
staleTime과 gcTime의 차이, prefetch와 hydration의 역할, skeleton UI와 캐싱 전략의 트레이드오프를 고민하면서
클라이언트 캐싱과 서버 캐싱의 장단점을 명확히 이해할 수 있었습니다.

특히 라이트하우스(Lighthouse) 지표를 지속적으로 확인하며 LCP(최대 콘텐츠 표시 시간)와 성능 점수를 개선해 나갔습니다.
점수가 점차 올라가는 과정을 보면서, 적용한 최적화가 실제 사용자 경험에 어떤 영향을 주는지 수치로 검증할 수 있었습니다.

아울러 Jest를 활용해 컴포넌트와 API 로직을 간단히 테스트하며,
UI 변경이나 리팩토링 이후에도 기능이 정상 동작하는지 빠르게 확인할 수 있었습니다.
반복적인 수동 테스트를 줄여주고 기능 개선 시 자신 있게 코드를 수정할 수 있다는 점이 특히 유용했습니다.

짧은 한 달 반의 기간이었지만, 단순 CRUD를 넘어서 데이터 캐싱, 무한 스크롤, 태그 필터링, 스켈레톤 UI, Jest 테스트까지 경험했고,
이를 지표와 테스트를 통해 검증하면서 Next.js와 React Query를 더욱 깊이 이해할 수 있었습니다.

---

## Technology Stack
- **Frontend:** Next.js 14/15, React, TypeScript, React Query v5, TailwindCSS, Flowbite-React  
- **Backend:** Prisma, MongoDB  
- **Testing:** Jest, MSW, MongoMemoryServer  
- **Deployment:** Vercel  

---

## ⚙️ Setup & Usage

### 1. Install JavaScript Packages
```bash
npm install

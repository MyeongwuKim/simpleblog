# SimpleBlog (1인개발)
> Next.js + Prisma + MongoDB 기반 개인 블로그 서비스  

🔗 **Deployment URL**  
👉 [https://mw-simpleblog.vercel.app](https://mw-simpleblog.vercel.app)  

---

## 📌 Summary
- velog를 기반으로 만든 사진 글을 작성/관리할 수 있는 개인 블로그 서비스  
- **Next.js 14/15 기반**으로 App Router와 **React Query v5** 학습 및 적용  
- **Prisma + MongoDB**를 사용해 게시글, 태그, 댓글 모델링 및 데이터 관리  
- **주요 기능**
  - ✍️ react-markdown을 통한 글 작성 / 수정 / 삭제
  - 👤 프로필 작성 및 수정
  - 📝 임시 저장글 관리
  - 💬 코멘트 작성 및 삭제
  - 🔑 next-auth를 통한 oAuth 로그인 제공
  - 🏷️ 태그 등록 및 필터링
  - ♾️ 무한 스크롤 및 로딩 스켈레톤

---

## 📖 Background
Next.js 13을 학습하며 만들었던 블로그를 경험 삼아, 이번에는 Velog를 참고해 나만의 블로그를 새롭게 제작했습니다.  
이전 블로그는 UX/UI 측면에서 어색한 부분이 있었고, Next.js 버전도 오래되어 한계가 있었습니다.  

그래서 단순 CRUD를 넘어 **캐싱, 무한 스크롤, 태그 관리** 같은 실제 서비스 패턴을 적용하고,  
**React Query, Prisma, Jest** 등 최신 기술들을 직접 실험해보는 공간으로 삼았습니다.  

---

## 💡 What I Learned
초창기에 단순히 만들었던 블로그와 달리, 이번에는 **성능 최적화와 불필요한 렌더링 최소화**에 집중했습니다.  
`useMemo`, `useCallback`을 적극적으로 활용하고 React DevTools로 렌더링 과정을 분석하며 최적화를 진행했습니다.  

또한 Next.js의 **SSR, ISR, 캐시 무효화(`revalidateTag`)**를 학습·적용했고,  
React Query의 `invalidateQueries`와 `setQueryData`를 활용해 **데이터 최신화와 UX/UI 개선**에도 많은 고민을 기울였습니다.  
특히 React Query와 Next.js의 캐싱 레이어 차이를 직접 비교·실험하면서,  
`staleTime`과 `gcTime`, `prefetch`와 `hydration`, skeleton UI와 캐싱 전략의 트레이드오프를 경험적으로 이해할 수 있었습니다.  

더불어 Lighthouse 지표를 통해 **LCP(최대 콘텐츠 표시 시간)**와 성능 점수를 개선하며  
적용한 최적화가 실제 사용자 경험에 어떤 영향을 주는지 **수치로 검증**했습니다.  

또한 Jest로 컴포넌트와 API 로직을 간단히 테스트하여 리팩토링 이후에도 기능이 안정적으로 유지됨을 확인했습니다.  
이를 통해 반복적인 수동 테스트를 줄이고 **안정적인 코드 개선 환경**을 마련할 수 있었습니다.  

짧은 한 달 반이었지만, **데이터 캐싱, 무한 스크롤, 태그 필터링, 스켈레톤 UI, Jest 테스트**까지 경험하며  
Next.js와 React Query에 대한 이해를 한층 깊게 다질 수 있었습니다.

---

## 🛠 Technology Stack
- **Frontend:** Next.js 14/15, React, TypeScript, React Query v5, TailwindCSS, Flowbite-React  
- **Backend:** Prisma, MongoDB  
- **Testing:** Jest, MongoMemoryServer  
- **Deployment:** Vercel  

---

## ⚙️ Setup & Usage

### 1. 데모버전 체험하기
```bash
# 🚀 실행 방법
npm run demo

# SimpleBlog (1인개발)
> Next.js + Prisma + MongoDB 기반 개인 블로그 서비스  

🔗 **Deployment URL**  
👉 [https://simpleblog.vercel.app](https://simpleblog.vercel.app)  

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
- 성능 최적화와 **불필요한 렌더링 최소화**에 집중  
  - `useMemo`, `useCallback` 적극 활용  
  - React DevTools로 렌더링 분석  

- **Next.js 핵심 기능 학습 & 적용**
  - SSR, ISR, 캐시 무효화(`revalidateTag`)  
  - React Query `invalidateQueries`, `setQueryData` 활용 → **UX/UI 개선**  

- **캐싱 전략 비교 & 실험**
  - `staleTime` vs `gcTime`  
  - `prefetch` vs `hydration`  
  - **skeleton UI와 캐싱 전략 트레이드오프**  

- **클라이언트 캐싱 vs 서버 캐싱** → 장단점을 명확히 이해  

- **Lighthouse 지표 검증**
  - LCP(최대 콘텐츠 표시 시간)와 성능 점수를 직접 개선  
  - 적용한 최적화가 사용자 경험에 미친 효과를 **수치로 검증**  

- **테스트 경험**
  - Jest로 컴포넌트 & API 로직 테스트  
  - 기능 리팩토링 이후에도 안정성 보장 → **자신 있게 코드 개선 가능**  

---

## 🛠 Technology Stack
- **Frontend:** Next.js 14/15, React, TypeScript, React Query v5, TailwindCSS, Flowbite-React  
- **Backend:** Prisma, MongoDB  
- **Testing:** Jest, MSW, MongoMemoryServer  
- **Deployment:** Vercel  

---

## ⚙️ Setup & Usage

### 1. 데모버전 체험하기
```bash
# 🚀 실행 방법
npm run demo

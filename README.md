# SimpleBlog (1인개발)

> Next.js + Prisma + MongoDB 기반 개인 블로그 서비스

🔗 **Deployment URL**
👉 https://mw-simpleblog.vercel.app

------------------------------------------------------------------------

## 📌 Overview

-   Velog 스타일의 개인 블로그를 **Next.js App Router + React Query + Prisma(MongoDB)**로 구축
-   단순 CRUD가 아니라 **캐싱 전략/무한 스크롤/이미지 정리 자동화**까지 포함
-   글/컬렉션/댓글/프로필/임시글/태그 관리 기능을 운영 가능한 형태로 구현
-   최근에는 **세션 범위 최적화, 페이지별 코드 스플리팅, 이미지 로딩 최적화**를 집중 반영
-   배포: https://mw-simpleblog.vercel.app

------------------------------------------------------------------------

## 🚀 Key Improvements

### 1) Post 캐싱 전략 분리

-   문제: 목록은 최신성이 중요하지만, 상세는 첫 로딩 체감이 중요
-   해결:
    -   목록: prefetch 제거 + fresh fetch
    -   상세: prefetch + `staleTime: 0` + `revalidateTag`
    -   mutation 시 `setQueryData`/`invalidateQueries`로 UI/서버 캐시 동기화
-   결과: 목록 최신성 유지와 상세 초기 체감속도를 동시에 확보

### 2) 무한 스크롤 및 읽기 페이지 최적화

-   문제: refetch 과다/불필요 렌더링으로 스크롤 UX 저하 가능성
-   해결:
    -   `useInfiniteQuery` + 화면 특성별 `staleTime` 조정
    -   필요한 곳에만 `useMemo`/`useCallback` 적용
    -   post 상세 TOC/markdown 렌더링 책임 분리
-   결과: 스크롤 흐름을 유지하면서 데이터 일관성 확보

### 3) 고아 이미지 자동 정리

-   문제: 글 삭제/수정/취소 시 Cloudflare 이미지가 남는 orphan 이슈
-   해결:
    -   `postId` null 이미지를 기준으로 orphan 식별
    -   Vercel Cron + Cloudflare API + DB 정리 배치 구성
-   결과: 불필요 저장소 누수 방지 및 운영 비용 관리

------------------------------------------------------------------------

## 🧾 Recent Optimization Log (2026.03.18 ~ 2026.03.21)

-   **2026.03.18**
    -   이미지 variant(`thumbnail`/`avatar`) 적용, 불필요 `priority` 제거
    -   Write `Editor`/`Preview` dynamic import 분리
-   **2026.03.19**
    -   UI overlay(모달/토스트) 흐름 정리, 전역 toast bridge 제거
    -   Post/Profile/Write 화면 단위 코드 스플리팅 적용
    -   comments reCAPTCHA dynamic import 분리
-   **2026.03.21**
    -   SessionProvider를 전역에서 라우트 범위로 축소(`SessionBoundary`)
    -   header/analytics의 세션 체크 경량화(`/api/auth/session`)
    -   컬렉션 API `mode=post` 경량 응답 추가
    -   폰트 preload/fallback 정리

------------------------------------------------------------------------

## 🛠 Technology Stack

-   **Frontend:** Next.js 14/15, React, TypeScript, React Query v5,
    TailwindCSS, Flowbite-React
-   **Backend:** Prisma, MongoDB
-   **Testing:** Jest, MSW
-   **Deployment:** Vercel

------------------------------------------------------------------------

## ✅ Test & Quality

-   현재 테스트 상태: **9 suites / 33 tests 통과**
-   `npm run lint` 기준 ESLint warning/error 없음
-   1인 개발 특성상 전수 테스트보다 **회귀 위험이 큰 핵심 로직 우선**으로 테스트 작성
-   커버한 핵심 유틸:
    -   `getFormatImagesId` (markdown 이미지 ID 추출)
    -   `formatRelativeTime` / `formateDate` (시간/날짜 표기)
    -   `getDeliveryDomain` (Cloudflare URL 생성)
    -   `setScrollValue` / `getScrollValue` (scroll state 저장/복원)

------------------------------------------------------------------------

## ⚙️ Setup & Usage

``` bash
# demo mode (in-memory db)
npm run demo

# local development
npm run dev

# test
npm test -- --runInBand

# production build
npm run build
```

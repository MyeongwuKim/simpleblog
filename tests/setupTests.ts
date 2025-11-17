import { server } from "./mocks/server";
import "whatwg-fetch"; // ✅ fetch polyfill (중요)
import "@testing-library/jest-dom";

// 모든 테스트 시작 전에 서버를 켜기
beforeAll(() => server.listen());

// 각 테스트 끝난 뒤 핸들러 리셋 (다른 테스트에 영향 방지)
afterEach(() => server.resetHandlers());

// 모든 테스트 끝나면 서버 닫기
afterAll(() => server.close());

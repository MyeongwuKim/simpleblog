export default {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],
  // ts-jest 최신 권장 방식 (globals 쓰지 말고 transform에 넣기)
  transform: {
    "^.+\\.ts$": ["ts-jest", { useESM: true, tsconfig: true }],
  },
  extensionsToTreatAsEsm: [".ts"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // ← 이게 핵심. setup 실행 보장
  verbose: true,
};

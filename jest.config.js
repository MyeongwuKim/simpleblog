export default {
  testEnvironment: "jsdom",

  // 루트 폴더 구조 기준
  roots: ["<rootDir>/tests", "<rootDir>/components", "<rootDir>/app"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1", // 핵심!
    "^.+\\.(css|scss|sass)$": "identity-obj-proxy",
  },

  setupFilesAfterEnv: ["<rootDir>/tests/setupTests.ts"],

  transform: {
    "^.+\\.(t|j)sx?$": [
      "@swc/jest",
      {
        jsc: {
          parser: {
            syntax: "typescript",
            tsx: true,
          },
          transform: {
            react: {
              runtime: "automatic",
            },
          },
        },
      },
    ],
  },
};

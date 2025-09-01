// app/tests/jest.config.ts
module.exports = {
  rootDir: ".", // simpleblog 루트로 올림
  projects: [
    {
      displayName: "db",
      testEnvironment: "node",
      testMatch: ["<rootDir>/db/**/*.test.ts"],
      transform: {
        "^.+\\.[tj]sx?$": ["ts-jest", { tsconfig: true }],
      },
      setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    },
    {
      displayName: "components",
      testEnvironment: "jsdom",
      testMatch: ["<rootDir>/components/**/*.test.(ts|tsx)"],
      transform: {
        "^.+\\.[tj]sx?$": [
          "ts-jest",
          { tsconfig: "<rootDir>/../tsconfig.jest.json" },
        ],
      },
      setupFilesAfterEnv: ["<rootDir>/jest.rtl.setup.ts"],
      moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/../$1", // '@/foo' → simpleblog/app/foo
        "\\.(css|scss|sass|less)$": "identity-obj-proxy",
      },
    },
  ],

  verbose: true,
};

module.exports = {
  preset: "ts-jest", // Use ts-jest preset for TypeScript
  testEnvironment: "jsdom", // Use jsdom for simulating a browser environment
  transform: {
    "^.+\\.tsx?$": "ts-jest", // Transform .ts and .tsx files using ts-jest
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", // Map alias for your import paths
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"], // Include file extensions
};

import { resolve } from "node:path";
import typia from "@typia/unplugin/vite";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import dts from "vite-plugin-dts";

export default defineConfig({
	plugins: [
		typia(),
		dts({
			rollupTypes: true,
			tsconfigPath: "./tsconfig.json",
			exclude: ["**/*.test.ts", "**/*.spec.ts", "tests", "__tests__"],
		}),
		checker({
			biome: {
				command: "check",
			},
		}),
	],
	build: {
		lib: {
			entry: resolve(__dirname, "src/main.ts"),
			name: "sports-radar-crawler",
			fileName: "index",
		},
	},
});

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	build: {
		target: "esnext",
		copyPublicDir: true,
	},
	optimizeDeps: {
		esbuildOptions: {
			target: "esnext",
		},
	},
	esbuild: {
		supported: {
			"top-level-await": true,
		},
	},
});

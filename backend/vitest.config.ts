/// <reference types="vitest" />
import path from 'path'
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		include: ['src/tests/**/*.test.ts'],
		globals: true,
		environment: 'node',
	},
})

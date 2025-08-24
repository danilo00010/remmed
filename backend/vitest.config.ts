/// <reference types="vitest" />
import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	resolve: {
		alias: {
			'@errors': path.resolve(__dirname, 'src/domain/errors'),
		},
	},
	test: {
		include: ['src/tests/**/*.test.ts'],
		globals: true,
		environment: 'node',
	},
})

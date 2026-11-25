import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const envBasePath =
	(globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env
		?.BASE_PATH ?? '';
const basePath = envBasePath as '' | `/${string}`;

export default defineConfig(({ command }) => ({
	server: {
		allowedHosts: true
	},
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			paths: {
				base: command === 'serve' ? '' : basePath
			},
			adapter: adapter({
				pages: 'build',
				assets: 'build',
				fallback: '404.html'
			})
		})
	]
}));

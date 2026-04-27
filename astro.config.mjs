// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://sverm.dev',
	integrations: [
		starlight({
			title: 'Sverm',
			description: 'Developer hub for AI swarms — build, understand, and extend multi-agent AI systems.',
			logo: {
				dark: './src/assets/logo-dark.svg',
				light: './src/assets/logo-light.svg',
				replacesTitle: true,
			},
			defaultLocale: 'root',
			social: [
				// GitHub org coming soon
			],
			sidebar: [
				{
					label: 'Start here',
					items: [
						{ label: 'Getting Started', slug: 'getting-started' },
					],
				},
				{
					label: 'Concepts',
					collapsed: false,
					items: [
						{ label: 'What is an AI Swarm?', slug: 'concepts/what-is-ai-swarm' },
						{ label: 'Agent Model', slug: 'concepts/agent-model' },
						{ label: 'Communication Topologies', slug: 'concepts/communication-topologies' },
						{ label: 'Cost Routing', slug: 'concepts/cost-routing' },
						{ label: 'Memory & Context', slug: 'concepts/memory' },
					],
				},
				{
					label: 'Build',
					items: [
						{ label: 'Swarm Definitions', slug: 'swarm-definitions' },
						{ label: 'API Reference', slug: 'api-reference' },
					],
				},
				{
					label: 'Run',
					items: [
						{ label: 'Deployment', slug: 'deployment' },
						{ label: 'Examples', slug: 'examples' },
					],
				},
			],
			customCss: ['./src/styles/custom.css'],
			components: {
				Footer: './src/components/Footer.astro',
			},
		}),
	],
});

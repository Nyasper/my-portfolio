<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';
	import HeroSection from '$lib/components/HeroSection.svelte';
	import AboutSection from '$lib/components/AboutSection.svelte';
	import SkillsSection from '$lib/components/SkillsSection.svelte';
	import ProjectsSection from '$lib/components/ProjectsSection.svelte';
	import FaqSection from '$lib/components/FaqSection.svelte';
	import ContactSection from '$lib/components/ContactSection.svelte';
	import DotNav from '$lib/components/DotNav.svelte';

	const siteUrl = 'https://nyasper.dev'; // Replace with actual domain

	const structuredData = $derived({
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: 'Gonzalo',
		alternateName: 'Nyasper',
		url: siteUrl,
		jobTitle: 'Web Developer',
		description: m.hero_description(),
		sameAs: [
			'https://github.com/Nyasper',
			'https://x.com/placeholder',
			'https://linkedin.com/in/placeholder'
		],
		knowsAbout: [
			'JavaScript',
			'TypeScript',
			'Svelte',
			'SvelteKit',
			'React',
			'Next.js',
			'Vue.js',
			'.NET',
			'C#',
			'Node.js'
		]
	});
</script>

<svelte:head>
	<title>{m.hero_role()} | Gonzalo — Nyasper</title>
	<meta name="description" content={m.hero_description()} />
	<meta name="robots" content="index, follow" />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:title" content="{m.hero_role()} | Gonzalo — Nyasper" />
	<meta property="og:description" content={m.hero_description()} />
	<meta property="og:url" content={siteUrl} />
	<meta property="og:locale" content={getLocale() === 'es' ? 'es_ES' : 'en_US'} />
	<meta property="og:site_name" content="Nyasper Portfolio" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="{m.hero_role()} | Gonzalo — Nyasper" />
	<meta name="twitter:description" content={m.hero_description()} />

	<!-- Canonical -->
	<link rel="canonical" href={siteUrl} />

	<!-- Structured Data -->
	{@html `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`}
</svelte:head>

<a href="#main-content" class="skip-link">Skip to main content</a>

<DotNav />

<main id="main-content">
	<HeroSection />
	<AboutSection />
	<SkillsSection />
	<ProjectsSection />
	<ContactSection />
	<FaqSection />
</main>

<style>
	main {
		padding-top: 100px; /* offset for navbar */
		scroll-snap-type: y proximity;
	}

	.skip-link {
		position: absolute;
		top: -100%;
		left: 1rem;
		z-index: 10000;
		padding: 0.75rem 1.5rem;
		background: var(--accent-color);
		color: #fff;
		font-weight: 600;
		border-radius: 0 0 8px 8px;
		text-decoration: none;
		transition: top 0.2s ease;
	}

	.skip-link:focus {
		top: 0;
	}
</style>

<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';
	import { page } from '$app/state';
	import {
		PUBLIC_GITHUB_URL,
		PUBLIC_TWITTER_URL,
		PUBLIC_LINKEDIN_URL,
		PUBLIC_NAME,
		PUBLIC_DISPLAY_NAME
	} from '$env/static/public';
	import HeroSection from '$lib/components/HeroSection.svelte';
	import AboutSection from '$lib/components/AboutSection.svelte';
	import SkillsSection from '$lib/components/SkillsSection.svelte';
	import ProjectsSection from '$lib/components/ProjectsSection.svelte';
	import FaqSection from '$lib/components/FaqSection.svelte';
	import ContactSection from '$lib/components/ContactSection.svelte';
	import DotNav from '$lib/components/DotNav.svelte';

	const siteUrl = $derived(page.url.origin + page.url.pathname);

	const structuredData = $derived({
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: PUBLIC_NAME,
		alternateName: PUBLIC_DISPLAY_NAME,
		url: siteUrl,
		jobTitle: 'Web Developer',
		description: m.hero_description(),
		sameAs: [PUBLIC_GITHUB_URL, PUBLIC_TWITTER_URL, PUBLIC_LINKEDIN_URL],
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

	// Mark as read for TypeScript since it is used inside the HTML JSON-LD script tag
	void (() => structuredData);
</script>

<svelte:head>
	<title>{PUBLIC_NAME} | {m.hero_role()}</title>
	<meta name="description" content={m.hero_description()} />
	<meta name="robots" content="index, follow" />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:title" content="{m.hero_role()} | {PUBLIC_NAME} — {PUBLIC_DISPLAY_NAME}" />
	<meta property="og:description" content={m.hero_description()} />
	<meta property="og:url" content={siteUrl} />
	<meta property="og:locale" content={getLocale() === 'es' ? 'es_ES' : 'en_US'} />
	<meta property="og:site_name" content="{PUBLIC_DISPLAY_NAME} Portfolio" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="{m.hero_role()} | {PUBLIC_NAME} — {PUBLIC_DISPLAY_NAME}" />
	<meta name="twitter:description" content={m.hero_description()} />

	<!-- Canonical -->
	<link rel="canonical" href={siteUrl} />

	<!-- Structured Data -->
	<script type="application/ld+json">
		{@html JSON.stringify(structuredData)}
	</script>
</svelte:head>

<DotNav />

<div class="sections-container">
	<HeroSection />
	<AboutSection />
	<SkillsSection />
	<ProjectsSection />
	<ContactSection />
	<FaqSection />
</div>

<style>
	.sections-container {
		padding-top: 100px; /* offset for navbar */
		scroll-snap-type: y proximity;
	}

	/* Free scroll on mobile: snapping feels janky with variable-height sections */
	@media (max-width: 768px) {
		.sections-container {
			scroll-snap-type: none;
		}
	}
</style>

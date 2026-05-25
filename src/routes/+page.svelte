<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';
	import { page } from '$app/state';
	import { PUBLIC_GITHUB_URL, PUBLIC_TWITTER_URL, PUBLIC_LINKEDIN_URL, PUBLIC_NAME, PUBLIC_DISPLAY_NAME } from '$env/static/public';
	import HeroSection from '$lib/components/HeroSection.svelte';
	import AboutSection from '$lib/components/AboutSection.svelte';
	import SkillsSection from '$lib/components/SkillsSection.svelte';
	import ProjectsSection from '$lib/components/ProjectsSection.svelte';
	import FaqSection from '$lib/components/FaqSection.svelte';
	import ContactSection from '$lib/components/ContactSection.svelte';
	import DotNav from '$lib/components/DotNav.svelte';

	const siteUrl = $derived(page.url.href);

	const structuredData = $derived({
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: PUBLIC_NAME,
		alternateName: PUBLIC_DISPLAY_NAME,
		url: siteUrl,
		jobTitle: 'Web Developer',
		description: m.hero_description(),
		sameAs: [
			PUBLIC_GITHUB_URL,
			PUBLIC_TWITTER_URL,
			PUBLIC_LINKEDIN_URL
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

	// Mark as read for TypeScript since it is used inside the HTML JSON-LD script tag
	void (() => structuredData);
</script>

<svelte:head>
	<title>{m.hero_role()} | {PUBLIC_NAME} — {PUBLIC_DISPLAY_NAME}</title>
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

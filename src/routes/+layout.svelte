<script lang="ts">
	import type { Pathname } from '$app/types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import { setGlobalState, PortfolioGlobalState } from '$lib/stores/globalState.svelte';

	let { children } = $props();
	setGlobalState(new PortfolioGlobalState());
</script>

<svelte:head>
	<link rel="icon" href={favicon} />

	<!-- Locale alternates for SEO (hreflang) -->
	{#each locales as locale (locale)}
		<link
			rel="alternate"
			hreflang={locale}
			href={page.url.origin + resolve(localizeHref(page.url.pathname, { locale }) as Pathname)}
		/>
	{/each}
	<link rel="alternate" hreflang="x-default" href={page.url.origin + resolve('/')} />
</svelte:head>

<!-- Skip to main content link for keyboard users (WCAG 2.4.1) -->
<a href="#main-content" class="skip-link">
	{m.skip_to_content()}
</a>

<Navbar />

<main id="main-content" tabindex="-1">
	{@render children()}
</main>

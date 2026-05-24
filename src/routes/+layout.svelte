<script lang="ts">
	import type { Pathname } from '$app/types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { getLocale, locales, localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import { setGlobalState, PortfiolioGlobalState } from '$lib/stores/globalState.svelte';

	let { children } = $props();
	setGlobalState(new PortfiolioGlobalState());
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<!-- Skip to main content link for keyboard users (WCAG 2.4.1) -->
<a href="#main-content" class="skip-link visually-hidden">
	{m.skip_to_content()}
</a>

<Navbar />

<main id="main-content">
	{@render children()}
</main>

<!-- Locale alternates for SEO (hidden visually, available to screen readers) -->
<div class="visually-hidden" aria-hidden="true">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }) as Pathname)}>{locale}</a>
	{/each}
</div>

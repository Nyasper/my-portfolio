<script lang="ts">
	import type { Pathname } from '$app/types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import { setGlobalState, PortfiolioGlobalState } from '$lib/stores/globalState.svelte';

	let { children } = $props();
	setGlobalState(new PortfiolioGlobalState());
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<Navbar />
{@render children()}

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }) as Pathname)}>{locale}</a>
	{/each}
</div>

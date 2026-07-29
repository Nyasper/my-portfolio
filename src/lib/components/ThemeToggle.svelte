<script lang="ts">
	import { onMount } from 'svelte';

	let isLightTheme = $state(false);

	onMount(() => {
		const stored = localStorage.getItem('theme');
		if (stored) {
			isLightTheme = stored === 'light';
		} else {
			isLightTheme = window.matchMedia('(prefers-color-scheme: light)').matches;
		}
	});

	$effect(() => {
		const theme: 'dark' | 'light' = isLightTheme ? 'light' : 'dark';
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('theme', theme);
	});

	function toggleTheme() {
		isLightTheme = !isLightTheme;
	}
</script>

<button class="theme-toggle glass-panel" onclick={toggleTheme} aria-label="Toggle Theme">
	{#if isLightTheme}
		<!-- Sun Icon for switching to light -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			><circle cx="12" cy="12" r="5" /><path
				d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
			/></svg
		>
	{:else}
		<!-- Moon Icon for switching to dark -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg
		>
	{/if}
</button>

<style>
	.theme-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		cursor: pointer;
		border: 1px solid var(--glass-border);
		color: var(--text-main);
		transition:
			transform 0.3s ease,
			background-color 0.3s ease,
			box-shadow 0.3s ease;
	}

	.theme-toggle:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
		background: var(--glass-border);
	}
</style>

<script lang="ts">
	import { page } from '$app/state';
	import { getLocale, localizeHref, deLocalizeHref } from '$lib/paraglide/runtime';

	const currentLang = $derived(getLocale());
	const nextLang = $derived(currentLang === 'es' ? 'en' : 'es');
	const nextHref = $derived(localizeHref(deLocalizeHref(page.url.pathname), { locale: nextLang }));
</script>

<a href={nextHref} class="lang-toggle glass-panel" aria-label="Toggle Language / Cambiar idioma">
	<span class="lang-text">{currentLang.toUpperCase()}</span>
</a>

<style>
	.lang-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		cursor: pointer;
		border: 1px solid var(--glass-border);
		color: var(--text-main);
		transition: all 0.3s ease;
		font-weight: 600;
		font-size: 0.9rem;
		text-decoration: none;
	}

	.lang-toggle:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
		background: var(--glass-border);
		color: var(--text-main);
	}
</style>

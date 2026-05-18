<script lang="ts">
	import { getLocale, setLocale } from '$lib/paraglide/runtime';

	let currentLang = $derived(getLocale());
	let nextLang = $derived((currentLang === 'es' ? 'en' : 'es') as 'en' | 'es');

	function toggleLanguage() {
		setLocale(nextLang);
	}
</script>

<button class="lang-toggle glass-panel" onclick={toggleLanguage} aria-label="Toggle Language">
	<span class="lang-text">{currentLang === 'es' ? 'EN' : 'ES'}</span>
</button>

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
		box-shadow: 0 6px 20px rgba(0,0,0,0.15);
		background: var(--glass-border);
		color: var(--text-main);
	}
</style>

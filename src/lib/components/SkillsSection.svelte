<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import techstacks from '$lib/data/techstacks.json';
	import { getGlobalState, getTechColor } from '$lib/stores/globalState.svelte';

	type Tech = (typeof techstacks)[number];
	const globalState = getGlobalState();

	const categories = [
		{ key: 'language', label: m.skills_category_language },
		{ key: 'frontend', label: m.skills_category_frontend },
		{ key: 'fullstack', label: m.skills_category_fullstack },
		{ key: 'backend', label: m.skills_category_backend },
		{ key: 'platform', label: m.skills_category_platform },
		{ key: 'library', label: m.skills_category_library },
		{ key: 'infrastructure', label: m.skills_category_infrastructure }
	] as const;

	function getTechsByCategory(category: string): Tech[] {
		return techstacks.filter((t) => t.category === category);
	}

	function handleTechClick(event: MouseEvent, techId: number) {
		event.preventDefault();
		globalState.selectTech(techId);
		const target = document.getElementById('projects');
		if (target) {
			target.scrollIntoView({ behavior: 'smooth' });
		}
	}
</script>

<section id="skills" class="skills">
	<div class="skills-container glass-panel">
		<h2>{m.skills_title()}</h2>
		<p class="skills-subtitle">{m.skills_subtitle()}</p>

		{#each categories as cat (cat.key)}
			{@render category(cat)}
		{/each}
	</div>
</section>

{#snippet category({ key, label }: (typeof categories)[number])}
	{#if getTechsByCategory(key).length > 0}
		<div class="category-group" role="group" aria-label={label()}>
			<h3 class="category-label">{label()}</h3>
			<div class="tech-grid">
				{#each getTechsByCategory(key) as tech (tech.id)}
					{@render skillItem(tech)}
				{/each}
			</div>
		</div>
	{/if}
{/snippet}

{#snippet skillItem(tech: Tech)}
	{@const isSelected = globalState.selectedTechId === tech.id}
	<a
		href={tech.url}
		onclick={(e) => handleTechClick(e, tech.id)}
		aria-label={m.tech_filter_aria({ name: tech.name }) +
			(isSelected ? ` (${m.common_selected()})` : '')}
		class="tech-pill"
		class:active={isSelected}
		style={isSelected
			? `border-color: ${getTechColor(tech.id)}; box-shadow: 0 4px 12px ${getTechColor(tech.id)}2d;`
			: ''}
	>
		<span class="tech-icon" aria-hidden="true">
			{@html tech.icon}
		</span>
		<span class="tech-name">{tech.name}</span>
	</a>
{/snippet}

<style>
	.skills {
		min-height: 100vh;
		min-height: 100dvh;
		display: flex;
		align-items: center;
		justify-content: center;
		scroll-snap-align: start;
		scroll-margin-top: 70px;
		padding: 0;
	}

	.skills-container {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		text-align: center;
	}

	h2 {
		font-size: 2.5rem;
		font-weight: 700;
		margin-bottom: 0.75rem;
	}

	.skills-subtitle {
		font-size: 1.25rem;
		color: var(--text-muted);
		margin-bottom: 1.5rem;
	}

	.category-group {
		margin-bottom: 1.25rem;
	}

	.category-group:last-child {
		margin-bottom: 0;
	}

	.category-label {
		font-size: 0.85rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-muted);
		margin-bottom: 0.75rem;
	}

	.tech-grid {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.tech-pill {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.4rem 0.8rem;
		border-radius: 50px;
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		color: var(--text-main);
		text-decoration: none;
		font-size: 0.9rem;
		font-weight: 500;
		transition:
			transform 0.2s ease,
			border-color 0.2s ease,
			box-shadow 0.2s ease;
	}

	.tech-pill:hover {
		transform: translateY(-2px);
		border-color: var(--accent-color);
		box-shadow: 0 4px 12px rgba(88, 166, 255, 0.15);
	}

	.tech-pill:focus-visible {
		outline: 2px solid var(--accent-color);
		outline-offset: 2px;
	}

	.tech-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: 20px;
		height: 20px;
	}

	.tech-icon :global(svg) {
		width: 100%;
		height: 100%;
	}

	.tech-name {
		white-space: nowrap;
	}

	@media (max-width: 768px) {
		.skills {
			min-height: auto;
			padding: 2rem 0;
		}

		h2 {
			font-size: 2rem;
		}

		.tech-grid {
			gap: 0.5rem;
		}

		.tech-pill {
			padding: 0.4rem 0.75rem;
			font-size: 0.8rem;
		}
	}
</style>

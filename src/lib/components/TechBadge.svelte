<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import type techstacks from '$lib/data/techstacks.json';
	import { getGlobalState, getTechColor } from '$lib/stores/globalState.svelte';

	type Tech = (typeof techstacks)[number];

	let { tech, onSelect }: { tech: Tech; onSelect: (techId: number) => void } = $props();

	const globalState = getGlobalState();
	let isSelected = $derived(globalState.selectedTechId === tech.id);
</script>

<button
	type="button"
	onclick={() => onSelect(tech.id)}
	class="tag-badge"
	class:selected={isSelected}
	style="--tag-color: {getTechColor(tech.id)}"
	aria-label={m.tech_filter_aria({ name: tech.name })}
	aria-pressed={isSelected}
>
	<span class="tag-icon" aria-hidden="true">{@html tech.icon}</span>
	<span class="tag-text">{tech.name}</span>
</button>

<style>
	.tag-badge {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.3rem 0.65rem;
		border-radius: 30px;
		background: rgba(22, 27, 34, 0.4);
		border: 1px solid var(--glass-border);
		color: var(--text-main);
		font-size: 0.75rem;
		font-weight: 500;
		cursor: pointer;
		transition:
			transform 0.2s ease,
			border-color 0.2s ease,
			box-shadow 0.2s ease,
			background-color 0.2s ease;
	}

	.tag-badge:hover {
		border-color: var(--tag-color, var(--accent-color));
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
		transform: translateY(-1px);
	}

	.tag-badge.selected {
		background: rgba(255, 255, 255, 0.05);
		border-color: var(--tag-color, var(--accent-color));
		color: var(--text-main);
		font-weight: 600;
		box-shadow: 0 0 8px rgba(88, 166, 255, 0.15);
	}

	.tag-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 14px;
		height: 14px;
	}

	.tag-icon :global(svg) {
		width: 100%;
		height: 100%;
	}

	.tag-text {
		white-space: nowrap;
	}

	.tag-badge:focus-visible {
		outline: 2px solid var(--accent-color);
		outline-offset: 2px;
	}

	:global([data-theme='light']) .tag-badge {
		background: #ffffff;
		border-color: rgba(0, 0, 0, 0.08);
	}

	:global([data-theme='light']) .tag-badge.selected {
		background: rgba(9, 105, 218, 0.1);
	}

	/* More compact badges on larger mobile (481px–768px) */
	@media (min-width: 481px) and (max-width: 768px) {
		.tag-badge {
			font-size: 0.65rem;
			padding: 0.2rem 0.5rem;
			gap: 0.25rem;
		}

		.tag-icon {
			width: 12px;
			height: 12px;
		}
	}
</style>

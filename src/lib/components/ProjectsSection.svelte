<script lang="ts">
	import * as m from '$lib/paraglide/messages';
</script>

<!-- TODO: Tarjeta de proyecto en un portfolio → cada proyecto es un <article> -->

<section id="projects" class="projects">
	<div class="projects-container glass-panel">
			<h2>{m.projects_title()}</h2>
			<p class="projects-subtitle">{m.projects_subtitle()}</p>
	</div>
</section>

<style>
	.projects {
		padding: 6rem 0;
	}

	.projects-container {
		padding: 4rem;
		text-align: center;
	}

	h2 {
		font-size: 2.5rem;
		font-weight: 700;
		margin-bottom: 0.75rem;
	}

	.projects-subtitle {
		font-size: 1.25rem;
		color: var(--text-muted);
	}

	@media (max-width: 768px) {
		.projects-container {
			padding: 2rem;
		}

		h2 {
			font-size: 2rem;
		}
	}
</style>

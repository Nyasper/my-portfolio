<script lang="ts">
	import * as m from '$lib/paraglide/messages';
</script>

<section id="skills" class="skills">
	<div class="skills-container glass-panel">
			<h2>{m.skills_title()}</h2>
			<p class="skills-subtitle">{m.skills_subtitle()}</p>
		
	</div>
</section>

<style>
	.skills {
		padding: 6rem 0;
	}

	.skills-container {
		padding: 4rem;
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
	}

	@media (max-width: 768px) {
		.skills-container {
			padding: 2rem;
		}

		h2 {
			font-size: 2rem;
		}
	}
</style>

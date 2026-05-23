<script lang="ts">
	import * as m from '$lib/paraglide/messages';
</script>

<section id="about" class="about">
	<div class="about-container glass-panel">
		<h2>{m.about_title()}</h2>
		<p class="about-subtitle">{m.about_subtitle()}</p>

		<div class="about-content">
			<p>{@html m.about_p1()}</p>
			<p>{m.about_p2()}</p>
			<p>{m.about_p3_before()} <strong>{m.about_p3_highlight()}</strong></p>
		</div>
	</div>
</section>

<style>
	.about {
		padding: 6rem 0;
	}

	.about-container {
		padding: 4rem;
		text-align: center;
	}

	h2 {
		font-size: 2.5rem;
		font-weight: 700;
		margin-bottom: 0.75rem;
	}

	.about-subtitle {
		font-size: 1.25rem;
		color: var(--text-muted);
	}

	.about-content {
		text-align: left;
		margin-top: 2rem;
	}

	.about-content p {
		margin-bottom: 1rem;
		line-height: 1.7;
		color: var(--text-muted);
	}

	.about-content p:last-child {
		margin-bottom: 0;
	}

	.about-content :global(a) {
		color: var(--accent-color);
		text-decoration: none;
		font-weight: 600;
	}

	.about-content :global(a:hover) {
		text-decoration: underline;
	}

	@media (max-width: 768px) {
		.about-container {
			padding: 2rem;
		}

		h2 {
			font-size: 2rem;
		}
	}
</style>

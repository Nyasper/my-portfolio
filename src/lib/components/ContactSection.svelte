<script lang="ts">
	import * as m from '$lib/paraglide/messages';
</script>

<section id="contact" class="contact">
	<div class="contact-container glass-panel">
		<h2>{m.contact_title()}</h2>
		<p class="contact-subtitle">{m.contact_subtitle()}</p>

	
	</div>
</section>

<style>
	.contact {
		padding: 6rem 0;
	}

	.contact-container {
		padding: 4rem;
		text-align: center;
	}

	h2 {
		font-size: 2.5rem;
		font-weight: 700;
		margin-bottom: 0.75rem;
	}

	.contact-subtitle {
		font-size: 1.25rem;
		color: var(--text-muted);
	}

	@media (max-width: 768px) {
		.contact-container {
			padding: 2rem;
		}

		h2 {
			font-size: 2rem;
		}
	}
</style>

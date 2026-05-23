<script lang="ts">
	import * as m from '$lib/paraglide/messages';
</script>

<section id="home" class="hero">
	<div class="hero-content glass-panel">
		<header>
			<h1>{m.hero_greeting()} <span class="highlight">Gonzalo</span></h1>
			<h2>{m.hero_role()}</h2>
			<p>{m.hero_description()}</p>
		</header>

		<div class="cta-buttons">
			<a href="#projects" class="btn primary">{m.hero_cta_projects()}</a>
			<a href="#contact" class="btn secondary">{m.hero_cta_contact()}</a>
		</div>
	</div>
</section>

<style>
	.hero {
		min-height: calc(100vh - 100px);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.hero-content {
		padding: 4rem;
		text-align: center;
		max-width: 800px;
		width: 100%;
	}

	h1 {
		font-size: 3.5rem;
		margin-bottom: 0.5rem;
		font-weight: 700;
	}

	.highlight {
		color: var(--accent-color);
	}

	h2 {
		font-size: 2rem;
		color: var(--text-muted);
		margin-bottom: 1.5rem;
		font-weight: 400;
	}

	p {
		font-size: 1.25rem;
		line-height: 1.6;
		margin-bottom: 2.5rem;
		color: var(--text-muted);
	}

	.cta-buttons {
		display: flex;
		gap: 1.5rem;
		justify-content: center;
	}

	.btn {
		padding: 0.8rem 2rem;
		border-radius: 30px;
		font-weight: 600;
		font-size: 1.1rem;
		transition: all 0.3s ease;
	}

	.btn.primary {
		background: var(--accent-color);
		color: #ffffff;
		box-shadow: 0 4px 15px rgba(88, 166, 255, 0.3);
	}

	.btn.primary:hover {
		background: var(--accent-hover);
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(88, 166, 255, 0.4);
	}

	.btn.secondary {
		background: transparent;
		border: 2px solid var(--accent-color);
		color: var(--accent-color);
	}

	.btn.secondary:hover {
		background: rgba(88, 166, 255, 0.1);
		transform: translateY(-2px);
	}

	@media (max-width: 768px) {
		h1 {
			font-size: 2.5rem;
		}
		h2 {
			font-size: 1.5rem;
		}
		.hero-content {
			padding: 2rem;
		}
		.cta-buttons {
			flex-direction: column;
		}
	}
</style>

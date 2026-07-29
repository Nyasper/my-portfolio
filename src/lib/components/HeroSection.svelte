<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { PUBLIC_NAME, PUBLIC_DISPLAY_NAME } from '$env/static/public';

	const names = [PUBLIC_NAME, PUBLIC_DISPLAY_NAME];
	let displayedText = $state('');
	let showCursor = $state(true);

	$effect(() => {
		let currentIdx = 0;
		let charIdx = 0;
		let isDeleting = false;
		let timeoutId: ReturnType<typeof setTimeout>;

		function tick() {
			const currentName = names[currentIdx];

			if (!isDeleting) {
				charIdx++;
				displayedText = currentName.slice(0, charIdx);

				if (charIdx === currentName.length) {
					timeoutId = setTimeout(() => {
						isDeleting = true;
						tick();
					}, 2000);
					return;
				}
				timeoutId = setTimeout(tick, 80);
			} else {
				charIdx--;
				displayedText = currentName.slice(0, charIdx);

				if (charIdx === 0) {
					currentIdx = (currentIdx + 1) % names.length;
					isDeleting = false;
					timeoutId = setTimeout(tick, 300);
					return;
				}
				timeoutId = setTimeout(tick, 50);
			}
		}

		tick();

		const cursorInterval = setInterval(() => {
			showCursor = !showCursor;
		}, 530);

		return () => {
			clearTimeout(timeoutId);
			clearInterval(cursorInterval);
		};
	});
</script>

<section id="home" class="hero" aria-labelledby="hero-heading">
	<div class="hero-content glass-panel">
		<header>
			<h1 id="hero-heading">
				{m.hero_greeting()}
				<span class="visually-hidden">{names.join(' / ')}</span>
				<span class="typewriter" aria-hidden="true">
					<span class="highlight">{displayedText}</span>
					<span class="cursor" class:visible={showCursor}>|</span>
				</span>
			</h1>
			<p class="hero-role">
				<span class="brackets" aria-hidden="true">&lt;</span>{m.hero_role()}<span class="brackets" aria-hidden="true">/&gt;</span>
			</p>
			<p class="hero-description">{m.hero_description()}</p>
		</header>

		<nav class="cta-buttons" aria-label="Quick navigation">
			<a href="#projects" class="btn primary">{m.hero_cta_projects()}</a>
			<a href="#contact" class="btn secondary">{m.hero_cta_contact()}</a>
		</nav>
	</div>
</section>

<style>
	.hero {
		min-height: 100vh;
		min-height: 100dvh;
		display: flex;
		align-items: center;
		justify-content: center;
		scroll-snap-align: start;
		scroll-margin-top: 70px;
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

	.typewriter {
		display: inline-flex;
		align-items: baseline;
	}

	.cursor {
		color: var(--accent-color);
		font-weight: 300;
		margin-left: 2px;
		opacity: 0;
		transition: opacity 0.1s ease;
	}

	.cursor.visible {
		opacity: 1;
	}

	.hero-role {
		font-size: 2rem;
		color: var(--text-main);
		margin-bottom: 1.5rem;
		font-weight: 400;
	}

	.brackets {
		color: var(--accent-color);
		font-weight: 300;
		margin: 0 0.15em;
	}

	.hero-description {
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
		transition:
			transform 0.3s ease,
			background-color 0.3s ease,
			border-color 0.3s ease,
			color 0.3s ease,
			box-shadow 0.3s ease;
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
		.hero {
			min-height: auto;
			padding: 4rem 0;
		}

		h1 {
			font-size: 2.5rem;
		}
		.hero-role {
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

<script lang="ts">
	import * as m from '$lib/paraglide/messages';

	const sections = [
		{ id: 'home', label: () => m.nav_home() },
		{ id: 'about', label: () => m.nav_about() },
		{ id: 'skills', label: () => m.nav_skills() },
		{ id: 'projects', label: () => m.nav_projects() },
		{ id: 'contact', label: () => m.nav_contact() },
		{ id: 'faq', label: () => m.nav_faq() }
	];

	let activeSection = $state('home');

	$effect(() => {
		const observers: IntersectionObserver[] = [];

		for (const section of sections) {
			const el = document.getElementById(section.id);
			if (!el) continue;

			const observer = new IntersectionObserver(
				(entries) => {
					for (const entry of entries) {
						if (entry.isIntersecting) {
							activeSection = section.id;
						}
					}
				},
				{ rootMargin: '-40% 0px -40% 0px', threshold: 0 }
			);

			observer.observe(el);
			observers.push(observer);
		}

		return () => {
			for (const observer of observers) {
				observer.disconnect();
			}
		};
	});
</script>

<nav class="dot-nav" aria-label="Page sections">
	<ul>
		{#each sections as section (section.id)}
			<li>
				<a
					href="#{section.id}"
					class="dot-link"
					class:active={activeSection === section.id}
					aria-label={section.label()}
					aria-current={activeSection === section.id ? 'true' : undefined}
				>
					<span class="label">{section.label()}</span>
					<span class="dot" aria-hidden="true"></span>
				</a>
			</li>
		{/each}
	</ul>
</nav>

<style>
	.dot-nav {
		position: fixed;
		right: 2rem;
		top: 50%;
		transform: translateY(-50%);
		z-index: 999;
	}

	ul {
		list-style: none;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.75rem;
	}

	.dot-link {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		text-decoration: none;
		padding: 0.25rem 0;
	}

	.label {
		font-size: 0.75rem;
		font-weight: 400;
		color: var(--text-muted);
		white-space: nowrap;
		opacity: 0.6;
		transition:
			color 0.3s ease,
			opacity 0.3s ease;
	}

	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--text-muted);
		flex-shrink: 0;
		transition:
			background 0.3s ease,
			transform 0.3s ease,
			box-shadow 0.3s ease;
	}

	.dot-link:hover .dot {
		background: var(--accent-hover);
		transform: scale(1.3);
	}

	.dot-link:hover .label {
		opacity: 1;
		color: var(--text-main);
	}

	.dot-link.active .dot {
		background: var(--accent-color);
		transform: scale(1.5);
		box-shadow: 0 0 8px var(--accent-color);
	}

	.dot-link.active .label {
		opacity: 1;
		color: var(--accent-color);
		font-weight: 600;
	}

	.dot-link:focus-visible {
		outline: 2px solid var(--accent-color);
		outline-offset: 4px;
		border-radius: 4px;
	}

	@media (max-width: 768px) {
		.dot-nav {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.dot,
		.label {
			transition: none;
		}
	}
</style>

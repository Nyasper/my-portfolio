<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { resolve } from '$app/paths';
	import { PUBLIC_NAME, PUBLIC_DISPLAY_NAME } from '$env/static/public';
	import ThemeToggle from './ThemeToggle.svelte';
	import LanguageSwitcher from './LanguageSwitcher.svelte';
</script>

<nav class="navbar glass-panel" aria-label="Main navigation">
	<div class="navbar-content">
		<div class="logo">
			<a href={resolve('/')} rel="home" aria-label="{PUBLIC_NAME} - Home">
				<span class="name-slider">
					<span class="name-slide"
						>{PUBLIC_NAME.slice(0, -3)}<span class="accent">{PUBLIC_NAME.slice(-3)}</span></span
					>
					<span class="name-slide" aria-hidden="true"
						>{PUBLIC_DISPLAY_NAME.slice(0, -3)}<span class="accent"
							>{PUBLIC_DISPLAY_NAME.slice(-3)}</span
						></span
					>
				</span>
				<span class="logo-divider"> | </span>
				Web dev
			</a>
		</div>
		<ul class="nav-links">
			<li><a href="#home">{m.nav_home()}</a></li>
			<li><a href="#about">{m.nav_about()}</a></li>
			<li><a href="#skills">{m.nav_skills()}</a></li>
			<li><a href="#projects">{m.nav_projects()}</a></li>
			<li><a href="#contact">{m.nav_contact()}</a></li>
			<li><a href="#faq">{m.nav_faq()}</a></li>
		</ul>
		<div class="actions" role="group" aria-label="Theme and language settings">
			<ThemeToggle />
			<LanguageSwitcher />
		</div>
	</div>
</nav>

<style>
	.navbar {
		position: fixed;
		top: 1rem;
		left: 50%;
		transform: translateX(-50%);
		width: 90%;
		max-width: 1200px;
		z-index: 1000;
		border-radius: 50px;
	}

	.navbar-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 2rem;
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
	}

	.logo a {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--text-main);
		display: flex;
		align-items: center;
	}

	.logo .accent {
		color: var(--accent-color);
	}

	.name-slider {
		display: inline-flex;
		flex-direction: column;
		overflow: hidden;
		vertical-align: bottom;
		height: 1.5em;
		line-height: 1.5em;
	}

	.name-slide {
		transition: transform 0.4s ease;
	}

	.logo a:hover .name-slide {
		transform: translateY(-100%);
	}

	.logo-divider {
		color: var(--text-muted);
	}

	.nav-links {
		display: flex;
		list-style: none;
		gap: 2rem;
	}

	.nav-links a {
		color: var(--text-main);
		font-weight: 500;
		font-size: 1rem;
		position: relative;
	}

	.nav-links a::after {
		content: '';
		position: absolute;
		width: 0;
		height: 2px;
		bottom: -4px;
		left: 0;
		background-color: var(--accent-color);
		transition: width 0.3s ease;
	}

	.nav-links a:hover::after {
		width: 100%;
	}

	.nav-links a:focus-visible {
		outline: 2px solid var(--accent-color);
		outline-offset: 4px;
		border-radius: 2px;
	}

	.actions {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	@media (max-width: 768px) {
		.nav-links {
			display: none;
		}

		.name-slide {
			transition: none;
			transform: none;
		}

		.logo a:hover .name-slide {
			transform: none;
		}
	}
</style>

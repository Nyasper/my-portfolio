<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import type { Pathname } from '$app/types';
	import { resolve } from '$app/paths';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { PUBLIC_NAME, PUBLIC_DISPLAY_NAME } from '$env/static/public';
	import ThemeToggle from './ThemeToggle.svelte';
	import LanguageSwitcher from './LanguageSwitcher.svelte';

	// Localized home link so the current locale is preserved
	const homeHref = resolve(localizeHref('/') as Pathname);

	let menuOpen = $state(false);

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	function closeMenu() {
		menuOpen = false;
	}
</script>

<nav class="navbar glass-panel" aria-label={m.navbar_aria()}>
	<div class="navbar-content">
		<div class="logo">
			<a href={homeHref} rel="home" aria-label={m.navbar_logo_aria({ name: PUBLIC_NAME })}>
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
				<span class="logo-suffix"><span class="logo-divider"> | </span>Web dev</span>
			</a>
		</div>
		<ul id="mobile-menu" class={['nav-links', { open: menuOpen }]}>
			<li><a href="#home" onclick={closeMenu}>{m.nav_home()}</a></li>
			<li><a href="#about" onclick={closeMenu}>{m.nav_about()}</a></li>
			<li><a href="#skills" onclick={closeMenu}>{m.nav_skills()}</a></li>
			<li><a href="#projects" onclick={closeMenu}>{m.nav_projects()}</a></li>
			<li><a href="#contact" onclick={closeMenu}>{m.nav_contact()}</a></li>
			<li><a href="#faq" onclick={closeMenu}>{m.nav_faq()}</a></li>
		</ul>
		<div class="actions" role="group" aria-label={m.navbar_settings_aria()}>
			<ThemeToggle />
			<LanguageSwitcher />
			<button
				class={['hamburger', { open: menuOpen }]}
				onclick={toggleMenu}
				aria-label={menuOpen ? m.navbar_menu_close() : m.navbar_menu_open()}
				aria-expanded={menuOpen}
				aria-controls="mobile-menu"
			>
				<span class="hamburger-line"></span>
				<span class="hamburger-line"></span>
				<span class="hamburger-line"></span>
			</button>
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

	.logo {
		flex-shrink: 0;
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
		flex-shrink: 0;
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

	.hamburger {
		display: none;
		flex-direction: column;
		justify-content: center;
		gap: 5px;
		width: 40px;
		height: 40px;
		padding: 0;
		background: none;
		border: none;
		cursor: pointer;
		z-index: 1001;
	}

	.hamburger-line {
		display: block;
		width: 22px;
		height: 2px;
		background: var(--text-main);
		border-radius: 2px;
		transition:
			transform 0.3s ease,
			opacity 0.3s ease;
	}

	.hamburger.open .hamburger-line:nth-child(1) {
		transform: translateY(7px) rotate(45deg);
	}

	.hamburger.open .hamburger-line:nth-child(2) {
		opacity: 0;
	}

	.hamburger.open .hamburger-line:nth-child(3) {
		transform: translateY(-7px) rotate(-45deg);
	}

	@media (max-width: 1024px) {
		.navbar {
			width: calc(100% - 3rem);
		}

		.navbar-content {
			padding: 0.75rem 1rem;
		}

		.actions {
			gap: 0.75rem;
		}

		.hamburger {
			display: flex;
		}

		.nav-links {
			display: none;
			position: absolute;
			top: 100%;
			left: 0;
			right: 0;
			margin-top: 0.5rem;
			padding: 1rem 2rem;
			flex-direction: column;
			gap: 0;
			background: var(--glass-bg);
			border: 1px solid var(--glass-border);
			border-radius: 16px;
			opacity: 0;
			transform: translateY(-10px);
			pointer-events: none;
			transition:
				opacity 0.25s ease,
				transform 0.25s ease;
		}

		.nav-links.open {
			display: flex;
			opacity: 1;
			transform: translateY(0);
			pointer-events: auto;
		}

		.nav-links li {
			border-bottom: 1px solid var(--glass-border);
		}

		.nav-links li:last-child {
			border-bottom: none;
		}

		.nav-links a {
			display: block;
			padding: 0.75rem 0;
			font-size: 1rem;
		}

		.nav-links a::after {
			display: none;
		}

		/* Logo: " | Web dev" is shown from 481px upward. Hidden on very
		   small phones (≤480px) where the full logo + 3 action buttons
		   would overflow the navbar. */
		.logo a {
			font-size: 1.25rem;
		}

		.name-slide {
			animation: name-cycle 5s ease-in-out infinite;
		}

		@keyframes name-cycle {
			0%,
			40% {
				transform: translateY(0);
			}
			50%,
			90% {
				transform: translateY(-100%);
			}
			100% {
				transform: translateY(0);
			}
		}
	}

	/* Hide "| Web dev" on small screens*/
	@media (max-width: 392px) {
		.logo-suffix {
			display: none;
		}
	}
</style>

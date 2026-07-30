<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import {
		PUBLIC_GITHUB_URL,
		PUBLIC_GITHUB_USERNAME,
		PUBLIC_EMAIL,
		PUBLIC_TWITTER_URL,
		PUBLIC_TWITTER_USERNAME,
		PUBLIC_DISCORD_URL,
		PUBLIC_DISCORD_USERNAME,
		PUBLIC_LINKEDIN_URL,
		PUBLIC_LINKEDIN_USERNAME
	} from '$env/static/public';

	type Social = { name: string; url: string; icon: string; username: string };

	const socials: Social[] = [
		{
			name: 'GitHub',
			url: PUBLIC_GITHUB_URL,
			username: PUBLIC_GITHUB_USERNAME,
			icon: '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>'
		},
		{
			name: 'Email',
			url: `mailto:${PUBLIC_EMAIL}`,
			username: PUBLIC_EMAIL,
			icon: '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>'
		},
		{
			name: 'LinkedIn',
			url: PUBLIC_LINKEDIN_URL,
			username: PUBLIC_LINKEDIN_USERNAME,
			icon: '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>'
		},
		{
			name: 'X / Twitter',
			url: PUBLIC_TWITTER_URL,
			username: PUBLIC_TWITTER_USERNAME,
			icon: '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>'
		},
		{
			name: 'Discord',
			url: PUBLIC_DISCORD_URL,
			username: PUBLIC_DISCORD_USERNAME,
			icon: '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/></svg>'
		}
	];

	let copiedSocial = $state<string | null>(null);

	async function copyToClipboard(text: string, name: string) {
		try {
			await navigator.clipboard.writeText(text);
			copiedSocial = name;
			setTimeout(() => {
				copiedSocial = null;
			}, 2000);
		} catch {
			// clipboard API not available
		}
	}
</script>

<section id="contact" class="contact" aria-labelledby="contact-heading">
	<div class="contact-container glass-panel">
		<h2 id="contact-heading">{m.contact_title()}</h2>
		<p class="contact-subtitle">{m.contact_subtitle()}</p>

		<nav aria-label={m.contact_title()}>
			<ul class="social-links" role="list">
				{#each socials as social (social.name)}
					<li>
						{@render socialItem(social)}
					</li>
				{/each}
			</ul>
		</nav>

		<div aria-live="polite" class="visually-hidden">
			{#if copiedSocial}
				{copiedSocial}: {m.contact_copied()}
			{/if}
		</div>
	</div>
</section>

{#snippet socialItem({ name, url, icon, username }: Social)}
	{@const isExternal = !url.startsWith('mailto:')}
	<div class="social-card glass-panel">
		<a
			href={url}
			target={isExternal ? '_blank' : undefined}
			rel={isExternal ? 'noopener noreferrer' : undefined}
			aria-label={isExternal ? m.contact_social_aria({ name, username }) : `${name}: ${username}`}
			class="social-link-overlay"
		>
			{@html icon}
			<span class="social-name">{name}</span>
			<span class="username">{username}</span>
		</a>
		<button
			class="copy-btn"
			class:copied={copiedSocial === name}
			onclick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				copyToClipboard(username, name);
			}}
			aria-label={m.contact_copy_aria({ name })}
		>
			{#if copiedSocial === name}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg
				>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path
						d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
					/></svg
				>
			{/if}
		</button>
	</div>
{/snippet}

<style>
	.contact {
		min-height: 100vh;
		min-height: 100dvh;
		display: flex;
		align-items: center;
		justify-content: center;
		scroll-margin-top: 70px;
		padding: 0;
	}

	.contact-container {
		max-width: 1200px;
		margin: 0 auto;
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
		margin-bottom: 2.5rem;
	}

	.social-links {
		display: flex;
		justify-content: center;
		gap: 1.5rem;
		flex-wrap: wrap;
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.social-card {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		border-radius: 16px;
		min-width: 120px;
		transition:
			transform 0.3s ease,
			border-color 0.3s ease,
			box-shadow 0.3s ease;
	}

	.social-card:hover {
		border-color: var(--accent-color);
		box-shadow: 0 8px 25px rgba(88, 166, 255, 0.15);
	}

	@media (hover: hover) {
		.social-card:hover {
			transform: translateY(-4px);
		}
	}

	.social-link-overlay {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		padding: 1.5rem 2rem;
		padding-bottom: 2rem;
		width: 100%;
		height: 100%;
		color: var(--text-main);
		text-decoration: none;
	}

	.social-link-overlay :global(svg) {
		color: var(--text-muted);
		transition:
			color 0.2s ease,
			transform 0.2s ease;
	}

	.social-card:hover .social-link-overlay :global(svg) {
		color: var(--accent-color);
	}

	@media (hover: hover) {
		.social-card:hover .social-link-overlay :global(svg) {
			transform: scale(1.1);
		}
	}

	.social-name {
		font-size: 0.9rem;
		font-weight: 500;
	}

	.username {
		position: absolute;
		bottom: 0.4rem;
		left: 50%;
		transform: translateX(-50%) translateY(4px);
		font-size: 0.75rem;
		color: var(--text-muted);
		white-space: nowrap;
		opacity: 0;
		transition:
			opacity 0.2s ease,
			transform 0.2s ease;
	}

	.social-card:hover .username {
		opacity: 0.7;
		transform: translateX(-50%) translateY(0);
	}

	.copy-btn {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border: none;
		border-radius: 6px;
		background: transparent;
		color: var(--text-muted);
		cursor: pointer;
		opacity: 0;
		transform: scale(0.8);
		transition:
			opacity 0.2s ease,
			transform 0.2s ease,
			background 0.2s ease,
			color 0.2s ease;
	}

	.social-card:hover .copy-btn {
		opacity: 1;
		transform: scale(1);
	}

	.copy-btn:hover {
		background: rgba(255, 255, 255, 0.1);
		color: var(--accent-color);
	}

	.copy-btn:focus-visible {
		opacity: 1;
		outline: 2px solid var(--accent-color);
		outline-offset: 2px;
	}

	.copy-btn.copied {
		opacity: 1;
		color: #56d364;
	}

	@media (max-width: 768px) {
		.contact {
			min-height: auto;
			padding: 2rem 0;
		}

		.contact-container {
			padding: 2rem;
		}

		h2 {
			font-size: 2rem;
		}

		.social-links {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			grid-auto-rows: 1fr;
			gap: 1rem;
		}

		.social-card {
			min-width: 0;
			overflow: hidden;
		}

		.social-link-overlay {
			padding: 1.25rem 1.5rem;
		}

		.username {
			position: static;
			opacity: 0.7;
			max-width: 100%;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			font-size: 0.7rem;
			bottom: auto;
			left: auto;
			transform: none;
		}

		.copy-btn {
			opacity: 1;
			transform: scale(1);
		}
	}
</style>

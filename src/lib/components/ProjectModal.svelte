<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import type { getTechColor } from '$lib/stores/globalState.svelte';
	import { getGlobalState } from '$lib/stores/globalState.svelte';
	import projectsData from '$lib/data/projects.json';
	import techstacksData from '$lib/data/techstacks.json';

	type Project = (typeof projectsData)[number];
	type Tech = (typeof techstacksData)[number];

	const msg = m as unknown as Record<string, () => string>;

	let {
		project,
		techMap,
		getTechColorFn,
		onClose
	}: {
		project: Project;
		techMap: Map<number, Tech>;
		getTechColorFn: typeof getTechColor;
		onClose: () => void;
	} = $props();

	const globalState = getGlobalState();

	let activeImageIndex = $state(0);
	let modalElement = $state<HTMLElement | null>(null);
	let isLightboxOpen = $state(false);
	let lightboxCloseBtn = $state<HTMLButtonElement | null>(null);
	let galleryMainBtn = $state<HTMLButtonElement | null>(null);
	let prevActiveElementBeforeLightbox = $state<HTMLElement | null>(null);

	$effect(() => {
		const prev = document.activeElement as HTMLElement;
		activeImageIndex = 0;

		// Lock body scroll to prevent double scrollbar bug
		const originalOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		const timeout = setTimeout(() => {
			if (modalElement) {
				const focusable = modalElement.querySelector('button, [tabindex="0"]') as HTMLElement;
				focusable?.focus();
			}
		}, 30);

		return () => {
			clearTimeout(timeout);
			// Restore body scroll when modal closes
			document.body.style.overflow = originalOverflow;
			prev?.focus();
		};
	});

	$effect(() => {
		if (isLightboxOpen) {
			prevActiveElementBeforeLightbox = document.activeElement as HTMLElement;
			const timeout = setTimeout(() => {
				lightboxCloseBtn?.focus();
			}, 30);
			return () => clearTimeout(timeout);
		} else {
			if (prevActiveElementBeforeLightbox) {
				prevActiveElementBeforeLightbox.focus();
				prevActiveElementBeforeLightbox = null;
			}
		}
	});

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			if (isLightboxOpen) {
				isLightboxOpen = false;
			} else {
				onClose();
			}
		} else if (event.key === 'ArrowRight' && project.images && project.images.length > 1) {
			nextImage();
		} else if (event.key === 'ArrowLeft' && project.images && project.images.length > 1) {
			prevImage();
		} else if (event.key === 'Tab') {
			if (isLightboxOpen) {
				const lightboxOverlay = document.querySelector('.lightbox-overlay');
				if (!lightboxOverlay) return;
				const focusableElements = lightboxOverlay.querySelectorAll('button');
				if (focusableElements.length === 0) return;
				const firstElement = focusableElements[0] as HTMLElement;
				const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

				if (event.shiftKey) {
					if (document.activeElement === firstElement) {
						lastElement.focus();
						event.preventDefault();
					}
				} else {
					if (document.activeElement === lastElement) {
						firstElement.focus();
						event.preventDefault();
					}
				}
				return;
			}

			if (!modalElement) return;
			const focusableElements = modalElement.querySelectorAll(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			);
			const firstElement = focusableElements[0] as HTMLElement;
			const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

			if (event.shiftKey) {
				if (document.activeElement === firstElement) {
					lastElement.focus();
					event.preventDefault();
				}
			} else {
				if (document.activeElement === lastElement) {
					firstElement.focus();
					event.preventDefault();
				}
			}
		}
	}

	function nextImage() {
		if (!project.images?.length) return;
		activeImageIndex = (activeImageIndex + 1) % project.images.length;
	}

	function prevImage() {
		if (!project.images?.length) return;
		activeImageIndex = (activeImageIndex - 1 + project.images.length) % project.images.length;
	}

	function handleTechBadgeClick(event: MouseEvent, techId: number) {
		event.stopPropagation();
		globalState.selectTech(techId);
		const target = document.getElementById('projects');
		if (target) {
			target.scrollIntoView({ behavior: 'smooth' });
		}
		onClose();
	}

	function handleOverlayClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			onClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	bind:this={modalElement}
	class="modal-overlay"
	onclick={handleOverlayClick}
	role="dialog"
	aria-modal="true"
	aria-labelledby="modal-title"
	aria-describedby="modal-description"
	tabindex="-1"
>
	<div class="modal-content glass-panel">
		<button class="modal-close" onclick={onClose} aria-label={m.projects_close()}>
			<span aria-hidden="true">&times;</span>
		</button>

		<div class="modal-body">
			<div class="modal-grid">
				<!-- Details Info Section -->
				<div class="modal-info">
					<div class="modal-header-section">
						<span class="modal-date-badge">
							{m.projects_date_completed()}: <strong>{project.date}</strong>
						</span>
						<h3 id="modal-title" class="modal-title">{project.name}</h3>
						{@render statusBadge(project.status, true)}
					</div>

					<div class="modal-description" id="modal-description">
						<p>{msg[project.longDescription]()}</p>
					</div>

					{#if project.highlights && project.highlights.length > 0}
						<div class="modal-highlights">
							<h4>{m.projects_highlights()}</h4>
							<ul class="highlights-list">
								{#each project.highlights as highlight (highlight)}
									<li>
										<svg
											aria-hidden="true"
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="var(--accent-color)"
											stroke-width="3"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<polyline points="20 6 9 17 4 12" />
										</svg>
										<span>{msg[highlight]()}</span>
									</li>
								{/each}
							</ul>
						</div>
					{/if}

					<div class="modal-tech-section">
						<div class="card-tags">
							{#each project.techstack as techId (techId)}
								{@render techBadge(techId)}
							{/each}
						</div>
					</div>

					<div class="modal-links-section">
						<a
							href={project.github}
							target="_blank"
							rel="noopener noreferrer"
							class="modal-btn source glass-panel"
						>
							{@render githubIcon()}
							{m.projects_view_code()}
						</a>
						{#if project.status === 'active' && project.deploy}
							<a
								href={project.deploy}
								target="_blank"
								rel="noopener noreferrer"
								class="modal-btn live"
							>
								{@render externalLinkIcon()}
								{m.projects_visit_site()}
							</a>
						{/if}
					</div>
				</div>

				<!-- Gallery Section -->
				<div class="modal-gallery">
					<!-- Live region for gallery navigation announcements -->
					<div aria-live="polite" class="visually-hidden">
						{#if project.images && project.images.length > 1}
							{m.projects_gallery_image()}
							{activeImageIndex + 1}
							{m.projects_gallery_of()}
							{project.images.length}
						{/if}
					</div>
					<div class="gallery-main-wrapper">
						{#if project.images && project.images.length > 0}
							<button
								bind:this={galleryMainBtn}
								class="gallery-main-btn"
								onclick={() => (isLightboxOpen = true)}
								aria-label="Enlarge image preview"
							>
								<img
									src="/images/projects/{project.id}/{project.images[activeImageIndex]}"
									alt="{project.name} {m.projects_gallery_image()} {activeImageIndex +
										1} {m.projects_gallery_of()} {project.images.length}"
									class="gallery-main-img"
								/>
								<div class="enlarge-overlay" aria-hidden="true">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="28"
										height="28"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<polyline points="15 3 21 3 21 9" />
										<polyline points="9 21 3 21 3 15" />
										<line x1="21" y1="3" x2="14" y2="10" />
										<line x1="3" y1="21" x2="10" y2="14" />
									</svg>
								</div>
							</button>

							{#if project.images.length > 1}
								<button class="gallery-arrow prev" onclick={prevImage} aria-label="Previous image">
									&#8249;
								</button>
								<button class="gallery-arrow next" onclick={nextImage} aria-label="Next image">
									&#8250;
								</button>

								<div class="gallery-dots" role="group" aria-label={m.projects_gallery_images()}>
									{#each project.images as imagePath, index (imagePath)}
										<button
											class="dot"
											class:active={activeImageIndex === index}
											onclick={() => (activeImageIndex = index)}
											aria-label="{m.projects_gallery_image()} {index + 1}"
											aria-current={activeImageIndex === index ? 'true' : undefined}
										></button>
									{/each}
								</div>
							{/if}
						{:else}
							{@render projectInitials(project.name, true)}
						{/if}
					</div>

					{#if project.images && project.images.length > 1}
						<div class="gallery-thumbnails" role="group" aria-label={m.projects_gallery_images()}>
							{#each project.images as img, index (index)}
								<button
									class="thumbnail-btn"
									class:active={activeImageIndex === index}
									onclick={() => (activeImageIndex = index)}
									aria-label="{m.projects_gallery_image()} {index + 1}"
									aria-current={activeImageIndex === index ? 'true' : undefined}
								>
									<img
										src="/images/projects/{project.id}/{img}"
										alt="Thumbnail {index + 1}"
										class="thumbnail-img"
									/>
								</button>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

{#if isLightboxOpen && project.images && project.images.length > 0}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="lightbox-overlay"
		onclick={(e) => {
			if (e.target === e.currentTarget) isLightboxOpen = false;
		}}
		role="dialog"
		aria-modal="true"
		aria-label="Image preview lightbox"
		tabindex="-1"
	>
		<button
			bind:this={lightboxCloseBtn}
			class="lightbox-close"
			onclick={() => (isLightboxOpen = false)}
			aria-label="Close image preview"
		>
			<span aria-hidden="true">&times;</span>
		</button>

		<div class="lightbox-content">
			<img
				src="/images/projects/{project.id}/{project.images[activeImageIndex]}"
				alt="Enlarged screenshot of {project.name}"
				class="lightbox-img"
			/>

			{#if project.images.length > 1}
				<button class="lightbox-arrow prev" onclick={prevImage} aria-label="Previous image">
					&#8249;
				</button>
				<button class="lightbox-arrow next" onclick={nextImage} aria-label="Next image">
					&#8250;
				</button>
			{/if}
		</div>
	</div>
{/if}

{#snippet projectInitials(name: string, large = false)}
	<div class="gradient-placeholder" class:large aria-hidden="true">
		<span class="project-initials" class:large>
			{name
				.split(' ')
				.map((w) => w[0])
				.join('')
				.substring(0, 3)
				.toUpperCase()}
		</span>
	</div>
{/snippet}

{#snippet statusBadge(status: string, pill = false)}
	<span class="status-indicator {status}" class:pill>
		{#if status === 'active'}
			{m.projects_status_active()}
		{:else if status === 'inactive'}
			{m.projects_status_inactive()}
		{:else}
			{m.projects_status_archived()}
		{/if}
	</span>
{/snippet}

{#snippet techBadge(techId: number)}
	{@const tech = techMap.get(techId)}
	{#if tech}
		<button
			onclick={(e) => handleTechBadgeClick(e, techId)}
			class="tag-badge"
			class:selected={globalState.selectedTechId === techId}
			style="--tag-color: {getTechColorFn(techId)}"
			aria-label="Filter by {tech.name}"
		>
			<span class="tag-icon" aria-hidden="true">{@html tech.icon}</span>
			<span class="tag-text">{tech.name}</span>
		</button>
	{/if}
{/snippet}

{#snippet githubIcon()}
	<svg
		aria-hidden="true"
		xmlns="http://www.w3.org/2000/svg"
		width="18"
		height="18"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		><path
			d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
		></path></svg
	>
{/snippet}

{#snippet externalLinkIcon()}
	<svg
		aria-hidden="true"
		xmlns="http://www.w3.org/2000/svg"
		width="18"
		height="18"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline
			points="15 3 21 3 21 9"
		></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg
	>
{/snippet}

<style>
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		z-index: 2000;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		animation: fade-in 0.3s ease;
	}

	.modal-content {
		position: relative;
		width: 100%;
		max-width: 1300px;
		max-height: 90vh;
		border-radius: 20px;
		overflow-y: auto;
		overflow-x: hidden;
		animation: zoom-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
		border: 1px solid var(--glass-border);
		box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
	}

	.modal-close {
		position: absolute;
		top: 1.25rem;
		right: 1.25rem;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid var(--glass-border);
		color: var(--text-main);
		font-size: 1.5rem;
		line-height: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		z-index: 10;
		transition: all 0.2s ease;
	}

	.modal-close:hover {
		background: var(--accent-color);
		color: #0d1117;
		border-color: var(--accent-color);
		transform: rotate(90deg);
	}

	.modal-body {
		padding: 3rem;
	}

	.modal-grid {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	@media (min-width: 1276px) {
		.modal-grid {
			display: grid;
			grid-template-columns: 1.1fr 1fr;
			gap: 3rem;
			align-items: center;
		}
	}

	/* Gallery */
	.modal-gallery {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.gallery-main-wrapper {
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 9;
		border-radius: 12px;
		overflow: hidden;
		background: rgba(0, 0, 0, 0.4);
		border: 1px solid var(--glass-border);
	}

	.gallery-main-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		animation: fade-in-img 0.25s ease-out;
	}

	.gallery-arrow {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background: rgba(13, 17, 23, 0.7);
		border: 1px solid var(--glass-border);
		color: var(--text-main);
		font-size: 1.75rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
		z-index: 5;
		padding-bottom: 4px;
	}

	.gallery-arrow:hover {
		background: var(--accent-color);
		color: #0d1117;
		border-color: var(--accent-color);
	}

	.gallery-arrow.prev {
		left: 1rem;
	}

	.gallery-arrow.next {
		right: 1rem;
	}

	.gallery-dots {
		position: absolute;
		bottom: 1rem;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: 0.5rem;
		z-index: 5;
	}

	.gallery-dots .dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.4);
		border: none;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.gallery-dots .dot.active {
		background: var(--accent-color);
		transform: scale(1.3);
	}

	.gallery-thumbnails {
		display: flex;
		gap: 0.75rem;
		overflow-x: auto;
		margin-top: 1rem;
		padding-top: 4px;
		padding-bottom: 0.5rem;
	}

	.thumbnail-btn {
		width: 140px;
		aspect-ratio: 16 / 9;
		border-radius: 8px;
		overflow: hidden;
		background: none;
		border: 2px solid transparent;
		cursor: pointer;
		padding: 0;
		flex-shrink: 0;
		transition: all 0.2s ease;
		opacity: 0.6;
	}

	.thumbnail-btn:hover {
		opacity: 0.9;
	}

	.thumbnail-btn.active {
		border-color: var(--accent-color);
		opacity: 1;
		transform: translateY(-2px);
	}

	.thumbnail-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* Modal Info */
	.modal-info {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.modal-date-badge {
		font-size: 0.85rem;
		color: var(--text-muted);
		display: block;
		margin-bottom: 0.5rem;
	}

	.modal-title {
		font-size: 2rem;
		font-weight: 700;
		color: var(--text-main);
		margin-bottom: 0.75rem;
		line-height: 1.2;
	}

	.modal-description {
		font-size: 1.05rem;
		color: var(--text-muted);
		line-height: 1.6;
	}

	.modal-highlights h4 {
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--text-main);
		margin-bottom: 0.75rem;
	}

	.highlights-list {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
	}

	.highlights-list li {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		font-size: 0.95rem;
		color: var(--text-main);
		line-height: 1.4;
	}

	.highlights-list li svg {
		margin-top: 2px;
		flex-shrink: 0;
	}

	.modal-tech-section {
		border-top: 1px solid var(--glass-border);
		padding-top: 1.25rem;
	}

	.modal-links-section {
		display: flex;
		gap: 1rem;
		margin-top: auto;
		border-top: 1px solid var(--glass-border);
		padding-top: 1.5rem;
	}

	.modal-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		border-radius: 50px;
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
		text-decoration: none;
		transition: all 0.25s ease;
	}

	.modal-btn.source {
		border: 1px solid var(--glass-border);
		color: var(--text-main);
	}

	.modal-btn.source:hover {
		background: rgba(255, 255, 255, 0.1);
		border-color: var(--text-main);
		transform: translateY(-2px);
	}

	.modal-btn.live {
		background: var(--accent-color);
		color: #0d1117;
		border: 1px solid var(--accent-color);
	}

	.modal-btn.live:hover {
		background: var(--accent-hover);
		border-color: var(--accent-hover);
		transform: translateY(-2px);
		box-shadow: 0 4px 15px rgba(88, 166, 255, 0.35);
	}

	/* Status Indicator (unified) */
	.status-indicator {
		display: inline-block;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		padding: 0.25rem 0.75rem;
		border-radius: 20px;
	}

	.status-indicator:not(.pill) {
		position: absolute;
		top: 1rem;
		right: 1rem;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
	}

	.status-indicator.active {
		background: rgba(46, 160, 67, 0.2);
		border: 1px solid rgba(46, 160, 67, 0.5);
		color: #56d364;
	}

	.status-indicator.inactive {
		background: rgba(210, 153, 34, 0.2);
		border: 1px solid rgba(210, 153, 34, 0.5);
		color: #e3b341;
	}

	.status-indicator.archived {
		background: rgba(248, 81, 73, 0.15);
		border: 1px solid rgba(248, 81, 73, 0.4);
		color: #ff7b72;
	}

	.status-indicator.pill.active {
		background: rgba(46, 160, 67, 0.15);
		border-color: rgba(46, 160, 67, 0.4);
	}

	.status-indicator.pill.inactive {
		background: rgba(210, 153, 34, 0.15);
		border-color: rgba(210, 153, 34, 0.4);
	}

	.status-indicator.pill.archived {
		background: rgba(248, 81, 73, 0.15);
		border-color: rgba(248, 81, 73, 0.4);
	}

	/* Gradient Placeholder (unified) */
	.gradient-placeholder {
		width: 100%;
		height: 100%;
		background: linear-gradient(135deg, rgba(22, 27, 34, 0.8) 0%, rgba(13, 17, 23, 0.9) 100%);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.project-initials {
		font-size: 2.25rem;
		font-weight: 800;
		background: linear-gradient(135deg, var(--text-main) 0%, var(--accent-color) 100%);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		letter-spacing: 0.05em;
	}

	.project-initials.large {
		font-size: 4rem;
	}

	/* Tech Tags */
	.card-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: auto;
		margin-bottom: 1.5rem;
	}

	.tag-badge {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.3rem 0.65rem;
		border-radius: 30px;
		background: rgba(22, 27, 34, 0.4);
		border: 1px solid var(--glass-border);
		color: var(--text-main);
		font-size: 0.75rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.tag-badge:hover {
		border-color: var(--tag-color, var(--accent-color));
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
		transform: translateY(-1px);
	}

	.tag-badge.selected {
		background: rgba(255, 255, 255, 0.05);
		border-color: var(--tag-color, var(--accent-color));
		color: var(--text-main);
		font-weight: 600;
		box-shadow: 0 0 8px rgba(88, 166, 255, 0.15);
	}

	.tag-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 14px;
		height: 14px;
	}

	.tag-icon :global(svg) {
		width: 100%;
		height: 100%;
	}

	.tag-text {
		white-space: nowrap;
	}

	/* Focus-visible styles for accessibility */
	.modal-close:focus-visible,
	.gallery-arrow:focus-visible,
	.dot:focus-visible,
	.thumbnail-btn:focus-visible,
	.modal-btn:focus-visible,
	.tag-badge:focus-visible {
		outline: 2px solid var(--accent-color);
		outline-offset: 2px;
	}

	/* Animations */
	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes fade-in-img {
		from {
			opacity: 0.3;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes zoom-in {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	@media (max-width: 1275px) {
		.modal-body {
			padding: 2rem;
		}

		.gallery-main-wrapper {
			aspect-ratio: 16 / 9;
		}

		.thumbnail-btn {
			width: 100px;
		}
	}

	:global([data-theme='light']) .modal-content {
		background: #ffffff;
		border-color: rgba(0, 0, 0, 0.08);
		box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
	}

	:global([data-theme='light']) .modal-close {
		background: #ffffff;
		border-color: rgba(0, 0, 0, 0.08);
		color: var(--text-main);
	}

	:global([data-theme='light']) .modal-close:hover {
		background: var(--accent-color);
		color: #ffffff;
		border-color: var(--accent-color);
	}

	:global([data-theme='light']) .modal-btn.source {
		background: #ffffff;
		border-color: rgba(0, 0, 0, 0.08);
		color: var(--text-main);
	}

	:global([data-theme='light']) .modal-btn.source:hover {
		background: rgba(0, 0, 0, 0.02);
		border-color: var(--text-main);
		transform: translateY(-2px);
	}

	:global([data-theme='light']) .modal-btn.live:hover {
		color: #ffffff;
		box-shadow: 0 4px 15px rgba(9, 105, 218, 0.35);
	}

	:global([data-theme='light']) .gallery-arrow {
		background: rgba(255, 255, 255, 0.9);
		border-color: rgba(0, 0, 0, 0.08);
		color: var(--text-main);
	}

	:global([data-theme='light']) .gallery-arrow:hover {
		background: var(--accent-color);
		color: #ffffff;
		border-color: var(--accent-color);
	}

	:global([data-theme='light']) .tag-badge {
		background: #ffffff;
		border-color: rgba(0, 0, 0, 0.08);
	}

	:global([data-theme='light']) .tag-badge.selected {
		background: rgba(9, 105, 218, 0.1);
	}

	/* Clickable Gallery Image Button */
	.gallery-main-btn {
		width: 100%;
		height: 100%;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		position: relative;
		display: block;
		overflow: hidden;
		border-radius: 12px;
	}

	.enlarge-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		color: #ffffff;
		opacity: 0;
		transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);
		z-index: 4;
	}

	.gallery-main-btn:hover .enlarge-overlay,
	.gallery-main-btn:focus-visible .enlarge-overlay {
		opacity: 1;
	}

	.gallery-main-btn .gallery-main-img {
		transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
	}

	.gallery-main-btn:hover .gallery-main-img {
		transform: scale(1.04);
	}

	/* Lightbox full screen modal overlay */
	.lightbox-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(10, 10, 10, 0.92);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		z-index: 3000;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		animation: fade-in 0.25s ease-out;
	}

	.lightbox-close {
		position: absolute;
		top: 1.5rem;
		right: 1.5rem;
		width: 46px;
		height: 46px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.15);
		color: #ffffff;
		font-size: 2rem;
		line-height: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		z-index: 3010;
		transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
		padding-bottom: 2px;
	}

	.lightbox-close:hover {
		background: var(--accent-color);
		color: #0d1117;
		border-color: var(--accent-color);
		transform: rotate(90deg);
	}

	.lightbox-content {
		position: relative;
		max-width: 90%;
		max-height: 85vh;
		display: flex;
		align-items: center;
		justify-content: center;
		animation: zoom-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.lightbox-img {
		max-width: 100%;
		max-height: 85vh;
		object-fit: contain;
		border-radius: 12px;
		border: 1px solid rgba(255, 255, 255, 0.15);
		box-shadow: 0 25px 60px rgba(0, 0, 0, 0.85);
	}

	.lightbox-arrow {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 52px;
		height: 52px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.15);
		color: #ffffff;
		font-size: 2.25rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
		z-index: 3005;
		padding-bottom: 5px;
	}

	.lightbox-arrow:hover {
		background: var(--accent-color);
		color: #0d1117;
		border-color: var(--accent-color);
		transform: scale(1.08);
	}

	.lightbox-arrow.prev {
		left: -5rem;
	}

	.lightbox-arrow.next {
		right: -5rem;
	}

	@media (max-width: 1200px) {
		.lightbox-arrow.prev {
			left: -3rem;
		}

		.lightbox-arrow.next {
			right: -3rem;
		}
	}

	@media (max-width: 768px) {
		.lightbox-overlay {
			padding: 1rem;
		}

		.lightbox-arrow {
			width: 44px;
			height: 44px;
			font-size: 1.75rem;
			padding-bottom: 4px;
		}

		.lightbox-arrow.prev {
			left: 0.5rem;
		}

		.lightbox-arrow.next {
			right: 0.5rem;
		}
	}
</style>

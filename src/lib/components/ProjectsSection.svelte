<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import projectsData from '$lib/data/projects.json';
	import techstacksData from '$lib/data/techstacks.json';
	import { getGlobalState, getTechColor } from '$lib/stores/globalState.svelte';

	type Project = (typeof projectsData)[number];
	type Tech = (typeof techstacksData)[number];

	const globalState = getGlobalState();

	// Reference maps for fast O(1) lookup
	const techMap = new Map<number, Tech>(techstacksData.map((t) => [t.id, t as Tech]));

	// Reactive state for the currently active projects list
	const filteredProjects = $derived.by(() => {
		const selectedId = globalState.selectedTechId;
		if (selectedId === null) {
			return projectsData;
		}
		return projectsData.filter((project) => project.techstack.includes(selectedId));
	});

	// Active tech helper
	const activeTechName = $derived.by(() => {
		const selectedId = globalState.selectedTechId;
		if (selectedId === null) return '';
		return techMap.get(selectedId)?.name || '';
	});

	// Visibility state for animations
	let visibleIds = $state<Record<number, boolean>>({});

	// Modal State
	let selectedProject = $state<Project | null>(null);
	let activeImageIndex = $state<number>(0);
	let modalElement = $state<HTMLElement | null>(null);
	let previousActiveElement = $state<HTMLElement | null>(null);

	function openModal(project: Project) {
		previousActiveElement = document.activeElement as HTMLElement;
		selectedProject = project;
		activeImageIndex = 0;
		// Wait for DOM update, then focus modal for accessibility
		setTimeout(() => {
			if (modalElement) {
				const focusable = modalElement.querySelector('button, [tabindex="0"]') as HTMLElement;
				focusable?.focus();
			}
		}, 30);
	}

	function closeModal() {
		selectedProject = null;
		if (previousActiveElement) {
			previousActiveElement.focus();
		}
	}

	// Keyboard accessibility within Modal
	function handleKeyDown(event: KeyboardEvent) {
		if (!selectedProject) return;

		if (event.key === 'Escape') {
			closeModal();
		} else if (event.key === 'ArrowRight' && selectedProject.images) {
			nextImage();
		} else if (event.key === 'ArrowLeft' && selectedProject.images) {
			prevImage();
		} else if (event.key === 'Tab') {
			// Focus Trap
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
		if (!selectedProject || !selectedProject.images) return;
		activeImageIndex = (activeImageIndex + 1) % selectedProject.images.length;
	}

	function prevImage() {
		if (!selectedProject || !selectedProject.images) return;
		activeImageIndex =
			(activeImageIndex - 1 + selectedProject.images.length) % selectedProject.images.length;
	}

	// Custom action to manage scroll-entry animations with a cap on simultaneous transitions
	function scrollAnimate(node: HTMLElement, id: number) {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !visibleIds[id]) {
						// Limit simultaneous animations by staggering them slightly
						const currentlyAnimating = document.querySelectorAll('.project-card.animating').length;
						if (currentlyAnimating < 4) {
							node.classList.add('animating');
							visibleIds[id] = true;
							setTimeout(() => {
								node.classList.remove('animating');
							}, 600); // matches CSS transition duration
						} else {
							// Stagger entrance if many items enter simultaneously
							setTimeout(() => {
								visibleIds[id] = true;
							}, 250);
						}
					}
				});
			},
			{ threshold: 0.05 }
		);

		observer.observe(node);

		return {
			destroy() {
				observer.disconnect();
			}
		};
	}

	function handleTechBadgeClick(event: MouseEvent, techId: number) {
		event.stopPropagation(); // prevent card click
		globalState.selectTech(techId);
		const target = document.getElementById('projects');
		if (target) {
			target.scrollIntoView({ behavior: 'smooth' });
		}
		// Close modal if tech is clicked inside it
		if (selectedProject) {
			closeModal();
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

<section id="projects" class="projects">
	<div class="projects-container">
		<div class="projects-header">
			<h2>{m.projects_title()}</h2>
			<p class="projects-subtitle">{m.projects_subtitle()}</p>
		</div>

		<!-- Filter Active Banner -->
		{#if globalState.selectedTechId !== null}
			<div class="filter-banner glass-panel">
				<div class="filter-info">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
					</svg>
					<span>
						{m.projects_filter_active()}
						<strong style="color: {getTechColor(globalState.selectedTechId)}">
							{activeTechName}
						</strong>
					</span>
				</div>
				<button
					onclick={() => globalState.clearFilter()}
					class="clear-filter-btn"
					aria-label={m.projects_filter_clear()}
				>
					{m.projects_filter_clear()}
					<span class="close-icon">&times;</span>
				</button>
			</div>
		{/if}

		<!-- Projects Grid -->
		{#if filteredProjects.length > 0}
			<div class="projects-grid">
				{#each filteredProjects as project (project.id)}
					{@const isVisible = !!visibleIds[project.id]}
					<article
						class="project-card glass-panel"
						class:fade-in-up={isVisible}
						data-id={project.id}
						use:scrollAnimate={project.id}
					>
						<!-- Image/Placeholder Slot -->
						<div class="card-image-wrapper">
							{#if project.images && project.images.length > 0}
								<img
									src="/images/projects/{project.id}/{project.images[0]}.png"
									alt={project.name}
									class="card-img"
									loading="lazy"
								/>
							{:else}
								<div class="gradient-placeholder">
									<div class="placeholder-content">
										<span class="project-initials">
											{project.name
												.split(' ')
												.map((w) => w[0])
												.join('')
												.substring(0, 3)
												.toUpperCase()}
										</span>
									</div>
								</div>
							{/if}

							<!-- Status Badge -->
							<span class="status-badge {project.status}">
								{#if project.status === 'active'}
									{m.projects_status_active()}
								{:else if project.status === 'inactive'}
									{m.projects_status_inactive()}
								{:else}
									{m.projects_status_archived()}
								{/if}
							</span>
						</div>

						<div class="card-content">
							<div class="card-meta">
								<span class="card-date">{project.date}</span>
							</div>
							<h3 class="card-title">{project.name}</h3>
							<p class="card-description">{project.shortDescription}</p>

							<!-- Tech Stack Badges -->
							<div class="card-tags">
								{#each project.techstack as techId (techId)}
									{@const tech = techMap.get(techId)}
									{#if tech}
										<button
											onclick={(e) => handleTechBadgeClick(e, techId)}
											class="tag-badge"
											class:selected={globalState.selectedTechId === techId}
											style="--tag-color: {getTechColor(techId)}"
											aria-label="Filter by {tech.name}"
										>
											<span class="tag-icon">{@html tech.icon}</span>
											<span class="tag-text">{tech.name}</span>
										</button>
									{/if}
								{/each}
							</div>

							<!-- Actions -->
							<div class="card-actions">
								<button
									onclick={() => openModal(project)}
									class="details-btn glass-panel"
									aria-label="View {project.name} details"
								>
									{m.projects_view_details()}
								</button>
								<div class="card-links">
									<a
										href={project.github}
										target="_blank"
										rel="noopener noreferrer"
										class="icon-link"
										aria-label="GitHub Repository"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="20"
											height="20"
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
									</a>
									{#if project.status === 'active' && project.deploy}
										<a
											href={project.deploy}
											target="_blank"
											rel="noopener noreferrer"
											class="icon-link"
											aria-label="Live Demo Website"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="20"
												height="20"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2"
												stroke-linecap="round"
												stroke-linejoin="round"
												><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
												></path><polyline points="15 3 21 3 21 9"></polyline><line
													x1="10"
													y1="14"
													x2="21"
													y2="3"
												></line></svg
											>
										</a>
									{/if}
								</div>
							</div>
						</div>
					</article>
				{/each}
			</div>
		{:else}
			<div class="no-projects-view glass-panel">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="48"
					height="48"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<circle cx="12" cy="12" r="10" />
					<line x1="12" y1="8" x2="12" y2="12" />
					<line x1="12" y1="16" x2="12.01" y2="16" />
				</svg>
				<p>{m.projects_no_projects()}</p>
				<button onclick={() => globalState.clearFilter()} class="clear-btn-full glass-panel">
					{m.projects_filter_clear()}
				</button>
			</div>
		{/if}
	</div>
</section>

<!-- IMMERSIVE DETAILS MODAL -->
{#if selectedProject}
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
	<div
		bind:this={modalElement}
		class="modal-overlay"
		onclick={closeModal}
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		tabindex="-1"
	>
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions, a11y_no_static_element_interactions -->
		<div
			class="modal-content glass-panel"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.key === 'Escape' && closeModal()}
		>
			<button class="modal-close" onclick={closeModal} aria-label={m.projects_close()}>
				&times;
			</button>

			<div class="modal-body">
				<!-- Modal Columns -->
				<div class="modal-grid">
					<!-- Gallery Column -->
					<div class="modal-gallery">
						<div class="gallery-main-wrapper">
							{#if selectedProject.images && selectedProject.images.length > 0}
								<img
									src="/images/projects/{selectedProject.id}/{selectedProject.images[
										activeImageIndex
									]}.png"
									alt="{selectedProject.name} Screenshot {activeImageIndex + 1}"
									class="gallery-main-img"
								/>

								<!-- Nav Arrows -->
								{#if selectedProject.images.length > 1}
									<button
										class="gallery-arrow prev"
										onclick={prevImage}
										aria-label="Previous image"
									>
										&#8249;
									</button>
									<button class="gallery-arrow next" onclick={nextImage} aria-label="Next image">
										&#8250;
									</button>

									<!-- Dot indicator -->
									<div class="gallery-dots">
										{#each selectedProject.images as _, index (index)}
											<button
												class="dot"
												class:active={activeImageIndex === index}
												onclick={() => (activeImageIndex = index)}
												aria-label="Go to image {index + 1}"
											></button>
										{/each}
									</div>
								{/if}
							{:else}
								<div class="gradient-placeholder-large">
									<span class="project-initials-large">
										{selectedProject.name
											.split(' ')
											.map((w) => w[0])
											.join('')
											.substring(0, 3)
											.toUpperCase()}
									</span>
								</div>
							{/if}
						</div>

						<!-- Thumbnails -->
						{#if selectedProject.images && selectedProject.images.length > 1}
							<div class="gallery-thumbnails">
								{#each selectedProject.images as imgIndex (imgIndex)}
									<button
										class="thumbnail-btn"
										class:active={activeImageIndex === imgIndex}
										onclick={() => (activeImageIndex = imgIndex)}
										aria-label="Preview screenshot {imgIndex + 1}"
									>
										<img
											src="/images/projects/{selectedProject.id}/{imgIndex}.png"
											alt="Thumbnail {imgIndex + 1}"
											class="thumbnail-img"
										/>
									</button>
								{/each}
							</div>
						{/if}
					</div>

					<!-- Details Info Column -->
					<div class="modal-info">
						<div class="modal-header-section">
							<span class="modal-date-badge">
								{m.projects_date_completed()}: <strong>{selectedProject.date}</strong>
							</span>
							<h3 id="modal-title" class="modal-title">{selectedProject.name}</h3>
							<span class="status-pill {selectedProject.status}">
								{#if selectedProject.status === 'active'}
									{m.projects_status_active()}
								{:else if selectedProject.status === 'inactive'}
									{m.projects_status_inactive()}
								{:else}
									{m.projects_status_archived()}
								{/if}
							</span>
						</div>

						<!-- Long Description -->
						<div class="modal-description">
							<p>{selectedProject.longDescription}</p>
						</div>

						<!-- Key Highlights -->
						{#if selectedProject.highlights && selectedProject.highlights.length > 0}
							<div class="modal-highlights">
								<h4>{m.projects_highlights()}</h4>
								<ul class="highlights-list">
									{#each selectedProject.highlights as highlight (highlight)}
										<li>
											<svg
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
											<span>{highlight}</span>
										</li>
									{/each}
								</ul>
							</div>
						{/if}

						<!-- Tech stack tags -->
						<div class="modal-tech-section">
							<div class="card-tags">
								{#each selectedProject.techstack as techId (techId)}
									{@const tech = techMap.get(techId)}
									{#if tech}
										<button
											onclick={(e) => handleTechBadgeClick(e, techId)}
											class="tag-badge"
											class:selected={globalState.selectedTechId === techId}
											style="--tag-color: {getTechColor(techId)}"
											aria-label="Filter by {tech.name}"
										>
											<span class="tag-icon">{@html tech.icon}</span>
											<span class="tag-text">{tech.name}</span>
										</button>
									{/if}
								{/each}
							</div>
						</div>

						<!-- Links Actions -->
						<div class="modal-links-section">
							<a
								href={selectedProject.github}
								target="_blank"
								rel="noopener noreferrer"
								class="modal-btn source glass-panel"
							>
								<svg
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
								{m.projects_view_code()}
							</a>
							{#if selectedProject.status === 'active' && selectedProject.deploy}
								<a
									href={selectedProject.deploy}
									target="_blank"
									rel="noopener noreferrer"
									class="modal-btn live"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2 2V8a2 2 0 0 1 2-2h6"
										></path><polyline points="15 3 21 3 21 9"></polyline><line
											x1="10"
											y1="14"
											x2="21"
											y2="3"
										></line></svg
									>
									{m.projects_visit_site()}
								</a>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.projects {
		padding: 6rem 0;
	}

	.projects-container {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
	}

	.projects-header {
		text-align: center;
		margin-bottom: 3rem;
	}

	h2 {
		font-size: 2.5rem;
		font-weight: 700;
		margin-bottom: 0.75rem;
	}

	.projects-subtitle {
		font-size: 1.25rem;
		color: var(--text-muted);
	}

	/* Filter Active Banner */
	.filter-banner {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 1.5rem;
		margin-bottom: 2rem;
		border-radius: 50px;
		animation: slide-down 0.3s ease-out;
	}

	.filter-info {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		color: var(--text-main);
	}

	.filter-info svg {
		color: var(--accent-color);
	}

	.clear-filter-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: none;
		border: none;
		color: var(--text-muted);
		cursor: pointer;
		font-size: 0.9rem;
		font-weight: 500;
		transition: color 0.2s ease;
	}

	.clear-filter-btn:hover {
		color: var(--accent-hover);
	}

	.close-icon {
		font-size: 1.25rem;
		line-height: 1;
	}

	/* Responsive grid of project cards */
	.projects-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
		gap: 2rem;
	}

	/* Card layout & entrance animation */
	.project-card {
		display: flex;
		flex-direction: column;
		border-radius: 16px;
		overflow: hidden;
		transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
		opacity: 0;
		transform: translateY(30px);
	}

	.project-card:hover {
		transform: translateY(-8px);
		border-color: var(--accent-color);
		box-shadow: 0 12px 30px rgba(88, 166, 255, 0.12);
	}

	/* Staggered entrance animation applied via IntersectionObserver state */
	.project-card.fade-in-up {
		opacity: 1;
		transform: translateY(0);
		transition:
			opacity 0.5s ease,
			transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
	}

	/* Card image wrapper */
	.card-image-wrapper {
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		background: rgba(0, 0, 0, 0.2);
	}

	.card-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.5s ease;
	}

	.project-card:hover .card-img {
		transform: scale(1.05);
	}

	/* Placeholders */
	.gradient-placeholder {
		width: 100%;
		height: 100%;
		background: linear-gradient(135deg, rgba(22, 27, 34, 0.8) 0%, rgba(13, 17, 23, 0.9) 100%);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.placeholder-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.project-initials {
		font-size: 2.25rem;
		font-weight: 800;
		background: linear-gradient(135deg, var(--text-main) 0%, var(--accent-color) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		letter-spacing: 0.05em;
	}

	/* Card status badges */
	.status-badge {
		position: absolute;
		top: 1rem;
		right: 1rem;
		padding: 0.25rem 0.75rem;
		border-radius: 20px;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
	}

	.status-badge.active {
		background: rgba(46, 160, 67, 0.2);
		border: 1px solid rgba(46, 160, 67, 0.5);
		color: #56d364;
	}

	.status-badge.inactive {
		background: rgba(210, 153, 34, 0.2);
		border: 1px solid rgba(210, 153, 34, 0.5);
		color: #e3b341;
	}

	.status-badge.archived {
		background: rgba(248, 81, 73, 0.15);
		border: 1px solid rgba(248, 81, 73, 0.4);
		color: #ff7b72;
	}

	/* Card Details content */
	.card-content {
		display: flex;
		flex-direction: column;
		padding: 1.5rem;
		flex-grow: 1;
	}

	.card-meta {
		margin-bottom: 0.5rem;
	}

	.card-date {
		font-size: 0.8rem;
		color: var(--text-muted);
		font-weight: 500;
	}

	.card-title {
		font-size: 1.35rem;
		font-weight: 600;
		margin-bottom: 0.75rem;
		color: var(--text-main);
		line-height: 1.25;
	}

	.card-description {
		font-size: 0.95rem;
		color: var(--text-muted);
		margin-bottom: 1.5rem;
		line-height: 1.5;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* Tech tags grid */
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
		background: var(--tag-color, var(--accent-color));
		border-color: var(--tag-color, var(--accent-color));
		color: #0d1117;
		font-weight: 600;
	}

	.tag-badge.selected :global(svg) {
		filter: brightness(0.1);
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

	/* Card Actions */
	.card-actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top: 1px solid var(--glass-border);
		padding-top: 1rem;
		margin-top: auto;
	}

	.details-btn {
		padding: 0.5rem 1.25rem;
		border-radius: 50px;
		font-size: 0.85rem;
		font-weight: 600;
		cursor: pointer;
		color: var(--text-main);
		border: 1px solid var(--glass-border);
		transition: all 0.25s ease;
	}

	.details-btn:hover {
		background: var(--accent-color);
		border-color: var(--accent-color);
		color: #0d1117;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(88, 166, 255, 0.25);
	}

	.card-links {
		display: flex;
		gap: 0.75rem;
	}

	.icon-link {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		color: var(--text-muted);
		background: rgba(22, 27, 34, 0.4);
		border: 1px solid var(--glass-border);
		transition: all 0.2s ease;
	}

	.icon-link:hover {
		color: var(--accent-color);
		border-color: var(--accent-color);
		transform: scale(1.08);
	}

	/* No projects view state */
	.no-projects-view {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 5rem 2rem;
		text-align: center;
		gap: 1.5rem;
		border-radius: 16px;
		margin-top: 2rem;
	}

	.no-projects-view svg {
		color: var(--text-muted);
	}

	.no-projects-view p {
		font-size: 1.2rem;
		color: var(--text-muted);
		max-width: 400px;
		line-height: 1.5;
	}

	.clear-btn-full {
		padding: 0.75rem 2rem;
		border-radius: 50px;
		font-size: 0.95rem;
		font-weight: 600;
		cursor: pointer;
		color: var(--text-main);
		border: 1px solid var(--glass-border);
		transition: all 0.2s ease;
	}

	.clear-btn-full:hover {
		border-color: var(--accent-color);
		color: var(--accent-color);
		transform: translateY(-2px);
	}

	/* IMMERSIVE MODAL */
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
		max-width: 1050px;
		max-height: 90vh;
		border-radius: 20px;
		overflow-y: auto;
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
		display: grid;
		grid-template-columns: 1.2fr 1fr;
		gap: 3rem;
	}

	/* Gallery Slot Inside Modal */
	.modal-gallery {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.gallery-main-wrapper {
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 10;
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

	.gradient-placeholder-large {
		width: 100%;
		height: 100%;
		background: linear-gradient(135deg, rgba(22, 27, 34, 0.8) 0%, rgba(13, 17, 23, 0.9) 100%);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.project-initials-large {
		font-size: 4rem;
		font-weight: 800;
		background: linear-gradient(135deg, var(--text-main) 0%, var(--accent-color) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		letter-spacing: 0.05em;
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
		gap: 0.5rem;
		overflow-x: auto;
		padding-bottom: 0.5rem;
	}

	.thumbnail-btn {
		width: 80px;
		aspect-ratio: 16 / 10;
		border-radius: 6px;
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

	/* Modal Info Column */
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

	.status-pill {
		display: inline-block;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		padding: 0.25rem 0.75rem;
		border-radius: 20px;
	}

	.status-pill.active {
		background: rgba(46, 160, 67, 0.15);
		border: 1px solid rgba(46, 160, 67, 0.4);
		color: #56d364;
	}

	.status-pill.inactive {
		background: rgba(210, 153, 34, 0.15);
		border: 1px solid rgba(210, 153, 34, 0.4);
		color: #e3b341;
	}

	.status-pill.archived {
		background: rgba(248, 81, 73, 0.15);
		border: 1px solid rgba(248, 81, 73, 0.4);
		color: #ff7b72;
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

	/* Modal links actions block */
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

	/* Animations DEFINITIONS */
	@keyframes slide-down {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

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

	/* Responsive tweaks */
	@media (max-width: 1024px) {
		.projects-container {
			padding: 0 1.5rem;
		}
	}

	@media (max-width: 900px) {
		.modal-grid {
			grid-template-columns: 1fr;
			gap: 2rem;
		}

		.modal-body {
			padding: 2rem;
		}

		.gallery-main-wrapper {
			aspect-ratio: 16 / 9;
		}
	}

	@media (max-width: 768px) {
		.projects {
			padding: 4rem 0;
		}

		h2 {
			font-size: 2rem;
		}

		.projects-grid {
			grid-template-columns: 1fr;
		}
	}
</style>

<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import projectsData from '$lib/data/projects.json';
	import techstacksData from '$lib/data/techstacks.json';
	import { getGlobalState, getTechColor } from '$lib/stores/globalState.svelte';
	import { PUBLIC_GITHUB_URL } from '$env/static/public';
	import ProjectModal from './ProjectModal.svelte';

	type Tech = (typeof techstacksData)[number];

	const globalState = getGlobalState();

	const techMap = new Map<number, Tech>(techstacksData.map((t) => [t.id, t as Tech]));

	const msg = m as unknown as Record<string, () => string>;

	const filteredProjects = $derived.by(() => {
		const selectedId = globalState.selectedTechId;
		if (selectedId === null) return projectsData;
		return projectsData.filter((project) => project.techstack.includes(selectedId));
	});

	const activeTechName = $derived(
		globalState.selectedTechId ? (techMap.get(globalState.selectedTechId)?.name ?? '') : ''
	);

	let selectedProject = $state<(typeof projectsData)[number] | null>(null);
	let sectionEl = $state<HTMLElement | null>(null);

	function openModal(project: (typeof projectsData)[number]) {
		selectedProject = project;
	}

	function closeModal() {
		selectedProject = null;
	}

	function handleTechBadgeClick(event: MouseEvent, techId: number) {
		event.stopPropagation();
		globalState.selectTech(techId);
		sectionEl?.scrollIntoView({ behavior: 'smooth' });
		if (selectedProject) {
			closeModal();
		}
	}


</script>

<section id="projects" class="projects" bind:this={sectionEl} aria-labelledby="projects-heading">
	<div class="projects-container">
		<div class="projects-header">
			<h2 id="projects-heading">{m.projects_title()}</h2>
			<p class="projects-subtitle">{m.projects_subtitle()}</p>
		</div>

		<!-- Projects Map Legend -->
		<div class="projects-legend glass-panel">
			<div class="legend-tip">
				<span class="tip-icon" aria-hidden="true">💡</span>
				<span class="tip-text">{m.projects_legend_tip()}</span>
			</div>
			<dl class="legend-statuses">
				<div class="legend-status">
					<dt>
						<span class="status-dot active" aria-hidden="true"></span>
						<span class="status-name">{m.projects_status_active()}</span>
					</dt>
					<dd class="status-desc">{m.projects_legend_active_desc()}</dd>
				</div>
				<div class="legend-status">
					<dt>
						<span class="status-dot inactive" aria-hidden="true"></span>
						<span class="status-name">{m.projects_status_inactive()}</span>
					</dt>
					<dd class="status-desc">{m.projects_legend_inactive_desc()}</dd>
				</div>
				<div class="legend-status">
					<dt>
						<span class="status-dot archived" aria-hidden="true"></span>
						<span class="status-name">{m.projects_status_archived()}</span>
					</dt>
					<dd class="status-desc">{m.projects_legend_archived_desc()}</dd>
				</div>
			</dl>
		</div>

		<!-- Filter Active Banner -->
		{#if globalState.selectedTechId !== null}
			<div class="filter-banner glass-panel" role="status" aria-live="polite">
				<div class="filter-info">
					{@render filterIcon()}
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
					<span class="close-icon" aria-hidden="true">&times;</span>
				</button>
			</div>
		{/if}

		<!-- Live region for screen reader filter announcements -->
		<div aria-live="polite" class="visually-hidden">
			{#if globalState.selectedTechId !== null}
				{m.projects_filter_active()}
				{activeTechName}.
				{filteredProjects.length}
				{filteredProjects.length === 1 ? m.projects_count_one() : m.projects_count_other()} {filteredProjects.length === 1 ? m.projects_found_one() : m.projects_found_other()}.
			{:else}
				{m.projects_showing_all()}
			{/if}
		</div>

		<!-- Projects Grid -->
		{#if filteredProjects.length > 0}
			<ul class="projects-grid">
			{#each filteredProjects as project (project.id)}
				<li>
					<article
						class="project-card glass-panel"
						aria-labelledby="project-title-{project.id}"
					>
							<div class="card-image-wrapper">
								{#if project.images && project.images.length > 0}
									<img
										src="/images/projects/{project.id}/{project.images[0]}"
										alt="Screenshot of {project.name} application"
										class="card-img"
										loading="lazy"
									/>
								{:else}
									{@render projectInitials(project.name)}
								{/if}

								{@render statusBadge(project.status)}
							</div>

							<div class="card-content">
								<div class="card-meta">
									<time class="card-date" datetime={project.date}>{project.date}</time>
								</div>
								<h3 class="card-title" id="project-title-{project.id}">{project.name}</h3>
								<p class="card-description">{msg[project.shortDescription]()}</p>

								<div class="card-tags">
									{#each project.techstack as techId (techId)}
										{@render techBadge(techId)}
									{/each}
								</div>

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
											aria-label="{project.name} GitHub repository"
										>
											{@render githubIcon(20)}
										</a>
										{#if project.status === 'active' && project.deploy}
											<a
												href={project.deploy}
												target="_blank"
												rel="noopener noreferrer"
												class="icon-link"
												aria-label="{project.name} live demo"
											>
												{@render externalLinkIcon(20)}
											</a>
										{/if}
									</div>
								</div>
							</div>
						</article>
					</li>
				{/each}

				<!-- CTA card to GitHub -->
				<li>
					<article class="project-card glass-panel more-projects-card" aria-label={m.projects_more_cta()}>
						<div class="more-projects-content">
							<div class="more-projects-icon">
								{@render githubIcon(48)}
							</div>
							<h3 class="more-projects-title">{m.projects_more_title()}</h3>
							<p class="more-projects-description">{m.projects_more_description()}</p>
							<a
								href={PUBLIC_GITHUB_URL}
								target="_blank"
								rel="noopener noreferrer"
								class="more-projects-btn glass-panel"
							>
								{@render externalLinkIcon(18)}
								{m.projects_more_cta()}
							</a>
						</div>
					</article>
				</li>
			</ul>
		{:else}
			<div class="no-projects-view glass-panel" role="status" aria-live="polite">
				{@render warningIcon()}
				<p>{m.projects_no_projects()}</p>
				<button onclick={() => globalState.clearFilter()} class="clear-btn-full glass-panel">
					{m.projects_filter_clear()}
				</button>
			</div>
		{/if}
	</div>
</section>

{#if selectedProject}
	<ProjectModal
		project={selectedProject}
		{techMap}
		getTechColorFn={getTechColor}
		onClose={closeModal}
	/>
{/if}

{#snippet projectInitials(name: string)}
	<div class="gradient-placeholder" aria-hidden="true">
		<span class="project-initials">
			{name
				.split(' ')
				.map((w) => w[0])
				.join('')
				.substring(0, 3)
				.toUpperCase()}
		</span>
	</div>
{/snippet}

{#snippet statusBadge(status: string)}
	<span class="status-badge {status}">
		{#if status === 'active'}
			<span aria-hidden="true">●</span>
			{m.projects_status_active()}
		{:else if status === 'inactive'}
			<span aria-hidden="true">○</span>
			{m.projects_status_inactive()}
		{:else}
			<span aria-hidden="true">◐</span>
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
			style="--tag-color: {getTechColor(techId)}"
			aria-label="Filter by {tech.name}"
			aria-pressed={globalState.selectedTechId === techId}
		>
			<span class="tag-icon" aria-hidden="true">{@html tech.icon}</span>
			<span class="tag-text">{tech.name}</span>
		</button>
	{/if}
{/snippet}

{#snippet filterIcon()}
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
	>
		<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
	</svg>
{/snippet}

{#snippet githubIcon(size = 18)}
	<svg
		aria-hidden="true"
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
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

{#snippet externalLinkIcon(size = 18)}
	<svg
		aria-hidden="true"
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
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

{#snippet warningIcon()}
	<svg
		aria-hidden="true"
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
{/snippet}

<style>
	.projects {
		min-height: 100vh;
		scroll-snap-align: start;
		scroll-margin-top: 70px;
		padding: 0;
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

	.filter-info :global(svg) {
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
		list-style: none;
		padding: 0;
		margin: 0;
	}

	/* Card layout */
	.project-card {
		display: flex;
		flex-direction: column;
		border-radius: 16px;
		overflow: hidden;
		transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
		height: 100%;
	}

	.project-card:hover {
		transform: translateY(-8px);
		border-color: var(--accent-color);
		box-shadow: 0 12px 30px rgba(88, 166, 255, 0.12);
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

	.project-initials {
		font-size: 2.25rem;
		font-weight: 800;
		background: linear-gradient(135deg, var(--text-main) 0%, var(--accent-color) 100%);
		-webkit-background-clip: text;
		background-clip: text;
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
		display: flex;
		align-items: center;
		gap: 0.35rem;
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

	.no-projects-view :global(svg) {
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

	/* More Projects CTA Card */
	.more-projects-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		min-height: 400px;
		border: 2px dashed var(--glass-border);
		background: transparent;
		cursor: default;
	}

	.more-projects-card:hover {
		border-color: var(--accent-color);
		transform: translateY(-4px);
		box-shadow: 0 12px 30px rgba(88, 166, 255, 0.08);
	}

	.more-projects-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
		padding: 2rem;
	}

	.more-projects-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 80px;
		height: 80px;
		border-radius: 50%;
		background: rgba(88, 166, 255, 0.08);
		border: 1px solid var(--glass-border);
		color: var(--accent-color);
	}

	.more-projects-title {
		font-size: 1.35rem;
		font-weight: 600;
		color: var(--text-main);
	}

	.more-projects-description {
		font-size: 0.95rem;
		color: var(--text-muted);
		line-height: 1.5;
		max-width: 420px;
	}

	.more-projects-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.65rem 1.5rem;
		border-radius: 50px;
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text-main);
		border: 1px solid var(--glass-border);
		text-decoration: none;
		transition: all 0.25s ease;
		margin-top: 0.5rem;
	}

	.more-projects-btn:hover {
		background: var(--accent-color);
		border-color: var(--accent-color);
		color: #0d1117;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(88, 166, 255, 0.25);
	}

	/* Focus-visible styles for accessibility */
	.project-card :is(button, a):focus-visible,
	.details-btn:focus-visible,
	.clear-filter-btn:focus-visible,
	.clear-btn-full:focus-visible,
	.tag-badge:focus-visible,
	.more-projects-btn:focus-visible {
		outline: 2px solid var(--accent-color);
		outline-offset: 2px;
	}

	/* Animations */
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

	/* Responsive tweaks */
	@media (max-width: 1024px) {
		.projects-container {
			padding: 0 1.5rem;
		}
	}

	@media (max-width: 768px) {
		.projects {
			min-height: auto;
			padding: 2rem 0;
		}

		h2 {
			font-size: 2rem;
		}

		.projects-grid {
			grid-template-columns: 1fr;
		}
	}

	/* Projects Legend Styles */
	.projects-legend {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 2rem;
		margin-bottom: 2rem;
		border-radius: 12px;
		gap: 1.5rem;
		flex-wrap: wrap;
	}

	.legend-tip {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9rem;
		color: var(--text-muted);
		font-weight: 500;
	}

	.tip-icon {
		font-size: 1.1rem;
	}

	.legend-statuses {
		display: flex;
		gap: 1.5rem;
		flex-wrap: wrap;
		margin: 0;
	}

	.legend-status {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.85rem;
	}

	.legend-status dt {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 600;
		color: var(--text-main);
	}

	.legend-status dd {
		margin: 0;
		color: var(--text-muted);
	}

	.status-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		display: inline-block;
	}

	.status-dot.active {
		background-color: #56d364;
		box-shadow: 0 0 8px rgba(86, 211, 100, 0.6);
	}

	.status-dot.inactive {
		background-color: #e3b341;
		box-shadow: 0 0 8px rgba(227, 179, 65, 0.6);
	}

	.status-dot.archived {
		background-color: #ff7b72;
		box-shadow: 0 0 8px rgba(255, 123, 114, 0.6);
	}

	.status-name {
		font-weight: 600;
		color: var(--text-main);
	}

	.status-desc {
		color: var(--text-muted);
	}

	@media (max-width: 768px) {
		.projects-legend {
			flex-direction: column;
			align-items: flex-start;
			padding: 1.25rem 1.5rem;
			gap: 1rem;
		}

		.legend-statuses {
			width: 100%;
			flex-direction: column;
			gap: 0.75rem;
		}
	}
</style>

<script lang="ts">
	let { name, large = false }: { name: string; large?: boolean } = $props();

	const initials = $derived(
		name
			.split(' ')
			.map((w) => w[0])
			.join('')
			.substring(0, 3)
			.toUpperCase()
	);
</script>

<div class="gradient-placeholder" aria-hidden="true">
	<span class="project-initials" class:large>{initials}</span>
</div>

<style>
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
</style>

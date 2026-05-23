<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import HeroSection from '$lib/components/HeroSection.svelte';
	import AboutSection from '$lib/components/AboutSection.svelte';
	import SkillsSection from '$lib/components/SkillsSection.svelte';
	import ProjectsSection from '$lib/components/ProjectsSection.svelte';
	import FaqSection from '$lib/components/FaqSection.svelte';
	import ContactSection from '$lib/components/ContactSection.svelte';
</script>

<svelte:head>
	<title>Portfolio</title>
	<meta name="description" content={m.hero_description()} />
</svelte:head>

<main class="container">
	<HeroSection />
	<AboutSection />
	<SkillsSection />
	<ProjectsSection />
	<ContactSection />
	<FaqSection />
</main>

<style>
	main {
		padding-top: 100px; /* offset for navbar */
	}
</style>

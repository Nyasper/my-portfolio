<script lang="ts">
	import * as m from '$lib/paraglide/messages';

	let openIndex: number | null = $state(null);

	const faqs = [
		{ question: m.faq_q1_question(), answer: m.faq_q1_answer() },
		{ question: m.faq_q2_question(), answer: m.faq_q2_answer() },
		{ question: m.faq_q3_question(), answer: m.faq_q3_answer() },
		{ question: m.faq_q4_question(), answer: m.faq_q4_answer() },
		{ question: m.faq_q5_question(), answer: m.faq_q5_answer() },
		{ question: m.faq_q6_question(), answer: m.faq_q6_answer() },
		{ question: m.faq_q7_question(), answer: m.faq_q7_answer() },
		{ question: m.faq_q8_question(), answer: m.faq_q8_answer() }
	];

	const faqStructuredData = $derived({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqs.map((faq) => ({
			'@type': 'Question',
			name: faq.question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: faq.answer
			}
		}))
	});

	function toggleQuestion(index: number) {
		openIndex = openIndex === index ? null : index;
	}
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify(faqStructuredData)}</script>`}
</svelte:head>

<section id="faq" class="faq" aria-labelledby="faq-heading">
	<div class="faq-container glass-panel">
		<h2 id="faq-heading">{m.faq_title()}</h2>
		<p class="faq-subtitle">{m.faq_subtitle()}</p>

		<div class="faq-list" role="list">
			{#each faqs as { question, answer }, i (question)}
				{@const isOpen = openIndex === i}
				<div class={['faq-item', { open: isOpen }]} role="listitem">
					<button
						id="faq-question-{i}"
						class="faq-question"
						onclick={() => toggleQuestion(i)}
						aria-expanded={openIndex === i}
						aria-controls="faq-answer-{i}"
					>
						<span>{question}</span>
						<span class="faq-icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
					</button>
					{#if isOpen}
						<div class="faq-answer" id="faq-answer-{i}" role="region" aria-labelledby="faq-question-{i}">
							<p>{answer}</p>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.faq {
		padding: 6rem 0;
	}

	.faq-container {
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

	.faq-subtitle {
		font-size: 1.25rem;
		color: var(--text-muted);
		margin-bottom: 2.5rem;
	}

	.faq-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		text-align: left;
	}

	.faq-item {
		border-radius: 12px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.08);
		overflow: hidden;
		transition: border-color 0.2s ease;
	}

	.faq-item.open {
		border-color: var(--accent-color);
	}

	.faq-question {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.25rem 1.5rem;
		background: none;
		border: none;
		color: inherit;
		font-size: 1.1rem;
		font-weight: 600;
		cursor: pointer;
		text-align: left;
		font-family: inherit;
	}

	.faq-question:hover {
		color: var(--accent-color);
	}

	.faq-question:focus-visible {
		outline: 2px solid var(--accent-color);
		outline-offset: -2px;
		border-radius: 12px;
	}

	.faq-icon {
		font-size: 1.5rem;
		font-weight: 300;
		color: var(--accent-color);
		flex-shrink: 0;
		margin-left: 1rem;
	}

	.faq-answer {
		padding: 0 1.5rem 1.25rem;
	}

	.faq-answer p {
		color: var(--text-muted);
		line-height: 1.7;
		margin: 0;
	}

	@media (max-width: 768px) {
		.faq-container {
			padding: 2rem;
		}

		h2 {
			font-size: 2rem;
		}

		.faq-question {
			padding: 1rem 1.25rem;
			font-size: 1rem;
		}

		.faq-answer {
			padding: 0 1.25rem 1rem;
		}
	}
</style>

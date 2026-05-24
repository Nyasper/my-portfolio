import { createContext } from 'svelte';

const brandColors: Record<number, string> = {
	1: '#f7df1e', // JavaScript
	2: '#3178c6', // TypeScript
	3: '#339933', // Node.js
	4: '#fbf0df', // Bun
	5: '#ff3e00', // Svelte
	6: '#ff3e00', // SvelteKit
	7: '#61dafb', // React
	8: '#ffffff', // Next.js
	9: '#4fc08d', // Vue.js
	10: '#dd0031', // Angular
	11: '#06b6d4', // Tailwind CSS
	12: '#828282', // Express
	13: '#e36002', // Hono
	14: '#6c63ff', // Better Auth
	15: '#c5f74c', // Drizzle ORM
	16: '#512bd4', // C#
	17: '#512bd4', // .NET
	18: '#512bd4', // ASP.NET
	19: '#1385cc', // Entity Framework
	20: '#4169e1', // PostgreSQL
	21: '#2496ed' // Docker
};

export function getTechColor(id: number): string {
	return brandColors[id] || '#58a6ff';
}

export class PortfiolioGlobalState {
	selectedTechId: number | null = $state(null);

	selectTech(techId: number) {
		if (this.selectedTechId === techId) {
			this.selectedTechId = null;
		} else {
			this.selectedTechId = techId;
		}
	}

	clearFilter() {
		this.selectedTechId = null;
	}
}
export const [getGlobalState, setGlobalState] = createContext<PortfiolioGlobalState>();
export const globalState = new PortfiolioGlobalState();

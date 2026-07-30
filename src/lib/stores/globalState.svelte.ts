import { createContext } from 'svelte';
import techstacks from '$lib/data/techstacks.json';

const colorMap = new Map<number, string>(techstacks.map((t) => [t.id, t.color]));

export function getTechColor(id: number): string {
	return colorMap.get(id) ?? '#58a6ff';
}

export class PortfolioGlobalState {
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
export const [getGlobalState, setGlobalState] = createContext<PortfolioGlobalState>();

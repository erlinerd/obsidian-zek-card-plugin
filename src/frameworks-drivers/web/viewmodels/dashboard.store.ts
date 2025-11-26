import { create } from "zustand";
import { webPlatformApi } from "@/frameworks-drivers/web/platform/WebPlatformApi";
import type { CardListItemDTO } from "@/frameworks-drivers/web/types";
import type { CardScene } from "@/domain/aggregates/card-note/enums/CardScene";
import { SceneType } from "@/frameworks-drivers/web/types";
import { createSelectors } from "./createSelectors";

export type DashboardVMState = {
	loading: boolean;
	error: string | null;
	cards: CardListItemDTO[];
	lastRefresh: Date | null;
	bySceneCounts: { idea: number; literature: number; topic: number };
	unknownCount: number;
	domains: { name: string; count: number }[];
	domainItems: { id: string; category: string; viewCount: number }[];
	sceneCards: Record<
		SceneType,
		{ name: string; path: string; scene: CardScene }[]
	>;
	sceneStatistics: Record<string, number>;
	fetchCards: () => Promise<void>;
};

export const useDashboardStoreBase = create<DashboardVMState>((set, get) => ({
	loading: false,
	error: null,
	cards: [],
	lastRefresh: null,
	bySceneCounts: { idea: 0, literature: 0, topic: 0 },
	unknownCount: 0,
	domains: [],
	domainItems: [],
    sceneCards: { literature: [], idea: [], topic: [] },
	sceneStatistics: { 文献: 0, 闪念: 0, 观点: 0 },
	fetchCards: async () => {
		if (get().loading) return;
		set({ loading: true, error: null });
		try {
			const items = await webPlatformApi.listAllCards();
			const counts: { idea: number; literature: number; topic: number } =
				{ idea: 0, literature: 0, topic: 0 };
			const domainCounter = new Map<string, number>();
			const grouped: Record<
				SceneType,
				{ name: string; path: string; scene: CardScene }[]
            > = { literature: [], idea: [], topic: [] };
			for (const c of items) {
				counts[c.scene as keyof typeof counts] =
					(counts[c.scene as keyof typeof counts] || 0) + 1;
				for (const d of c.domain || []) {
					domainCounter.set(d, (domainCounter.get(d) || 0) + 1);
				}
				const st = c.scene as SceneType;
				grouped[st].push({
					name: c.name,
					path: c.path,
					scene: c.scene,
				});
			}
			const total = items.length;
			const unknown = Math.max(
				0,
				total - counts.idea - counts.literature - counts.topic
			);
			const domainsArr = Array.from(domainCounter.entries()).map(
				([name, count]) => ({ name, count })
			);
			const domainItems = domainsArr.map((d, i) => ({
				id: `${d.name}-${i}`,
				category: d.name,
				viewCount: d.count,
			}));
			const stats: Record<string, number> = {
				文献: counts.literature,
				闪念: counts.idea,
				观点: counts.topic,
			};
			set({
				cards: items,
				lastRefresh: new Date(),
				loading: false,
				bySceneCounts: counts,
				unknownCount: unknown,
				domains: domainsArr,
				domainItems,
				sceneCards: grouped,
				sceneStatistics: stats,
			});
		} catch (e) {
			set({ error: String(e), loading: false });
		}
	},
}));

export const useDashboardStore = createSelectors(useDashboardStoreBase);

export const selectTotalCardCount = (s: DashboardVMState) => s.cards.length;
export const selectBySceneCounts = (s: DashboardVMState) => s.bySceneCounts;
export const selectUnknownCount = (s: DashboardVMState) => s.unknownCount;
export const selectDomains = (s: DashboardVMState) => s.domains;
export const selectDomainItems = (s: DashboardVMState) => s.domainItems;
export const selectSceneCards = (s: DashboardVMState) => s.sceneCards;
export const selectSceneStatistics = (s: DashboardVMState) => s.sceneStatistics;

export const selectLoading = (s: DashboardVMState) => s.loading;
export const selectLastRefresh = (s: DashboardVMState) => s.lastRefresh;
export const selectFetchCards = (s: DashboardVMState) => s.fetchCards;

/**
 * Stats component (smart component)
 *
 * Purpose:
 * Show card statistics and domain distribution in a three-by-two grid.
 *
 * Features:
 * - Self-contained component with data selection from store
 * - Six metrics: idea, literature, topic, total, unknown, domain count
 * - Domain list below with lazy loading
 */

import React, { Suspense } from "react";
import {
	Card,
	CardContent,
	Separator,
	StatsItem,
} from "@/frameworks-drivers/shared";
const LazyBarChart3 = React.lazy(() =>
	import("lucide-react").then((m) => ({ default: m.BarChart3 }))
);
const LazyZap = React.lazy(() =>
	import("lucide-react").then((m) => ({ default: m.Zap }))
);
const LazyBookOpen = React.lazy(() =>
	import("lucide-react").then((m) => ({ default: m.BookOpen }))
);
const LazyLightbulb = React.lazy(() =>
	import("lucide-react").then((m) => ({ default: m.Lightbulb }))
);
const LazyHelpCircle = React.lazy(() =>
	import("lucide-react").then((m) => ({ default: m.HelpCircle }))
);
const LazyGlobe = React.lazy(() =>
	import("lucide-react").then((m) => ({ default: m.Globe }))
);
const DomainListLazy = React.lazy(() =>
	import("@/frameworks-drivers/shared").then((m) => ({
		default: m.DomainList,
	}))
);
import { useDashboardStore, selectTotalCardCount, selectUnknownCount, selectBySceneCounts, selectDomains } from "@/frameworks-drivers/web";

export const Stats: React.FC = () => {
    const totalCardCount = useDashboardStore(selectTotalCardCount);
    const byScene = useDashboardStore(selectBySceneCounts);
	const flashCardCount = byScene.idea || 0;
	const literatureCardCount = byScene.literature || 0;
	const viewpointCardCount = byScene.topic || 0;
    const unknownCardCount = useDashboardStore(selectUnknownCount);
    const domains = useDashboardStore(selectDomains);
	// Compute unknown card count
	const calculatedUnknownCount =
		unknownCardCount ||
		Math.max(
			0,
			totalCardCount -
				flashCardCount -
				literatureCardCount -
				viewpointCardCount
		);

	return (
		<Card className="mb-4 ui-card ui-animate-in">
			<CardContent className="pt-4">
			{/* Three-by-two grid, compact spacing */}
				<Suspense
					fallback={<div className="grid grid-cols-2 gap-1 mb-2" />}
				>
					<div className="grid grid-cols-2 gap-1 mb-2">
					{/* Row 1 — Idea cards */}
						<StatsItem
							title="闪念卡"
							description="记录闪念和想法"
							count={flashCardCount}
							icon={LazyZap}
							type="warning"
						/>

					{/* Literature cards */}
						<StatsItem
							title="文献卡"
							description="文献和资料摘录"
							count={literatureCardCount}
							icon={LazyBookOpen}
							type="info"
						/>

					{/* Row 2 — Topic cards */}
						<StatsItem
							title="观点卡"
							description="观点和思考"
							count={viewpointCardCount}
							icon={LazyLightbulb}
							type="success"
						/>

					{/* Total card count */}
						<StatsItem
							title="总卡片数"
							description="系统中的卡片总数"
							count={totalCardCount}
							icon={LazyBarChart3}
							type="primary"
						/>

					{/* Row 3 — Unknown cards */}
						<StatsItem
							title="未知卡"
							description="未分类的卡片"
							count={calculatedUnknownCount}
							icon={LazyHelpCircle}
							type="secondary"
						/>

					{/* Domain count */}
						<StatsItem
							title="领域数量"
							description="不同领域的总数"
							count={domains.length}
							icon={LazyGlobe}
							type="accent"
						/>
					</div>
				</Suspense>

				{/* Separator */}
				<Separator className="my-2" />

				{/* Domain list */}
				<Suspense fallback={<div />}>
					<DomainListLazy domains={domains} />
				</Suspense>
			</CardContent>
		</Card>
	);
};

import { useEffect } from "react";
import ScenePanel from "@/frameworks-drivers/web/features/dashboard/ScenePanel";
import { DomainStatsContainer } from "./DomainPanel";
import { MOCStatsContainer } from "./MOCStatsContainer";
import { Stats } from "./Stats";
import { ModeToggle, cn } from "@/frameworks-drivers/shared";
import { DashboardHeader } from "@/frameworks-drivers/shared";
import {
	useDashboardStore,
	selectSceneCards,
	selectSceneStatistics,
	selectDomainItems,
	selectLoading,
	selectLastRefresh,
	selectFetchCards,
	selectTotalCardCount,
} from "@/frameworks-drivers/web";
import { toast } from "sonner";
import { Button } from "@/frameworks-drivers/shared";
import { RefreshCcw } from "lucide-react";
// Remove web fallback adapter; UI relies on injected data services only

/**
 * DashboardPanel component
 *
 * View-layer component responsible for UI and interactions.
 * Business logic is handled by use cases per Clean Architecture.
 */
export const DashboardPanel = () => {
    const loading = useDashboardStore(selectLoading);
    const lastRefresh = useDashboardStore(selectLastRefresh);
    const fetchCards = useDashboardStore(selectFetchCards);
    const totalCount = useDashboardStore(selectTotalCardCount);
    
    useEffect(() => {
        if (!loading && !lastRefresh) {
            fetchCards();
        }
    }, [loading, lastRefresh, fetchCards]);

	const mocItems: {
		id: string;
		name: string;
		path: string;
		lastAccessed: Date;
	}[] = [];

	const handleOpenCardFileCallback = (card: any) => {
		toast.info(`打开: ${card.path}`);
	};

	const handleCreateMocCallback = () => {};

	/**
	 * Main view rendering
	 * Keep original layout and interactions; data comes from use cases.
	 */
	return (
		<div className={cn("p-6 ui-panel")}>
		{/* Header area — keep original styles */}
			<div className="flex items-center justify-between mb-2">
				<DashboardHeader
					title="全部卡片"
					description={`最后更新: ${
						lastRefresh
							? lastRefresh.toLocaleTimeString()
							: "未刷新"
					}`}
				/>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="icon"
						className="ui-btn-icon"
						onClick={fetchCards}
					>
						<RefreshCcw className="h-[1.2rem] w-[1.2rem]" />
						<span className="sr-only">刷新</span>
					</Button>
					<ModeToggle />
				</div>
			</div>

		{/* Stats — use case-driven data */}
			<Stats />

		{/* Domain section — use case-driven data */}
			<DomainStatsContainer />

		{/* MOC section — using MOCStatsContainer */}
			<MOCStatsContainer
				mocItems={mocItems}
				loading={loading}
				onCreateMoc={handleCreateMocCallback}
				onOpenMocFile={(moc) => handleOpenCardFileCallback(moc)}
			/>
			<DashboardHeader title="卡片场景" description="" />
			<ScenePanel onOpenCardFile={handleOpenCardFileCallback} />
		</div>
	);
};

export default DashboardPanel;

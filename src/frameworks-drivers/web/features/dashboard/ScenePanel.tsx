/**
 * ScenePanel component
 *
 * Purpose:
 * Display scene statistics (counts by scene type) with tabs to view
 * the cards for each scene (Literature, Idea, Topic).
 *
 * Features:
 * - Total scenes count with highlighted styling
 * - Per-scene tabs with icon and color
 * - Empty state when no data
 * - Responsive grid and subtle transitions
 *
 * Placement:
 * Used in DashboardPanel as the scene summary section.
 *
 * Data sources:
 * - `SceneStatistics` for counts
 * - `SceneCardWithMetadata[]` for lists of cards per scene
 */

import React, { useState, useMemo, useCallback, Suspense } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger, EmptyState, SceneCardList } from '@/frameworks-drivers/shared';
const LazyBookOpen = React.lazy(() => import('lucide-react').then(m => ({ default: m.BookOpen })));
const LazyLightbulb = React.lazy(() => import('lucide-react').then(m => ({ default: m.Lightbulb })));
const LazyBarChart3 = React.lazy(() => import('lucide-react').then(m => ({ default: m.BarChart3 })));
const LazyBrainCircuit = React.lazy(() => import('lucide-react').then(m => ({ default: m.BrainCircuit })));
import { SceneType } from "@/frameworks-drivers/web/types";
import { useDashboardStore, selectSceneCards, selectSceneStatistics } from "@/frameworks-drivers/web";
 

// Scene configuration interface
interface SceneConfig {
    id: SceneType;
    label: string;
    value: SceneType;
    icon: React.ComponentType<{ className?: string }>;
    iconColorClass: string;
    colorClass: string;
    emptyMessage: string;
    title: string;
}

interface ScenePanelProps {
    onOpenCardFile?: (card: { name: string; path: string }) => void;
}

// Scene configuration constants
const SCENE_CONFIGS: Record<SceneType, SceneConfig> = {
	[SceneType.LITERATURE]: {
		id: SceneType.LITERATURE,
		label: "文献",
		value: SceneType.LITERATURE,
		icon: LazyBookOpen,
		iconColorClass: "text-chart-1",
		colorClass: "text-chart-1",
		emptyMessage: "暂无文献卡片",
		title: "文献",
	},
	[SceneType.IDEA]: {
		id: SceneType.IDEA,
		label: "闪念",
		value: SceneType.IDEA,
		icon: LazyLightbulb,
		iconColorClass: "text-chart-3",
		colorClass: "text-chart-3",
		emptyMessage: "暂无闪念卡片",
		title: "闪念",
	},
    [SceneType.TOPIC]: {
        id: SceneType.TOPIC,
        label: "观点",
        value: SceneType.TOPIC,
        icon: LazyBrainCircuit,
        iconColorClass: "text-chart-2",
        colorClass: "text-chart-2",
        emptyMessage: "暂无观点卡片",
        title: "观点",
    },
};

// SceneCardList is in a separate file



// Main component
const ScenePanel: React.FC<ScenePanelProps> = ({ onOpenCardFile }) => {
    const sceneStatistics = useDashboardStore(selectSceneStatistics);
    const sceneCards = useDashboardStore(selectSceneCards);
    const loading = useDashboardStore((s) => s.loading);
	// Memoize `hasAnyScene` and `totalScenes` calculations
    const { hasAnyScene } = useMemo(
        () => ({
            hasAnyScene: Object.values(sceneStatistics).some(
                (count) => count > 0
            ),
        }),
        [sceneStatistics]
    );

	const [activeTab, setActiveTab] = useState<SceneType>(SceneType.LITERATURE);

	// Render content for a specific scene
	const renderSceneContent = useCallback(
		(sceneType: SceneType) => {
			const config = SCENE_CONFIGS[sceneType];
			const filteredCards = sceneCards[sceneType] || [];

            return (
                <TabsContent
                    key={sceneType}
                    value={sceneType}
                    className="mt-4 ui-tabs-content"
                >
					<Suspense fallback={<div className="p-4" />}> 
                        <SceneCardList
                            cards={filteredCards}
                            loading={loading}
                            onOpenCardFile={onOpenCardFile ?? (() => undefined)}
                            emptyMessage={config.emptyMessage}
                            title={config.title}
                            icon={config.icon}
                            iconColorClass={config.iconColorClass}
                        />
					</Suspense>
				</TabsContent>
            );
		},
		[sceneCards, loading, onOpenCardFile]
	);

	// Render all scenes contents
	const sceneContents = useMemo(() => {
		return Object.values(SceneType).map((sceneType) =>
			renderSceneContent(sceneType)
		);
	}, [renderSceneContent]);

	// Render tab triggers
	const tabTriggers = useMemo(() => {
		return Object.values(SceneType).map((sceneType) => {
			const config = SCENE_CONFIGS[sceneType];
            const count = sceneStatistics[
                sceneType === SceneType.LITERATURE
                    ? "文献"
                    : sceneType === SceneType.IDEA
                    ? "闪念"
                    : "观点"
            ];

            return (
                <TabsTrigger
                    key={sceneType}
                    value={sceneType}
                    className="ui-tabs-trigger flex items-center justify-between"
                >
					<div className="flex items-center gap-2">
						<Suspense fallback={<div className={`h-4 w-4 ${config.iconColorClass}`} />}> 
							<config.icon
								className={`h-4 w-4 ${config.iconColorClass} group-data-[state=active]:text-primary-foreground`}
							/>
						</Suspense>
						<span className="font-medium group-data-[state=active]:text-primary-foreground">
							{config.label}
						</span>
					</div>
					<span className="text-xs group-data-[state=active]:text-primary-foreground px-2 py-1 font-medium">
						{count}
					</span>
				</TabsTrigger>
			);
		});
	}, [sceneStatistics]);

	return (
		<div className="space-y-4">
			{hasAnyScene ? (
		<Tabs
			value={activeTab}
			onValueChange={setActiveTab as (value: string) => void}
			className="w-full"
		>
            <TabsList className="ui-tabs-list grid w-full grid-cols-3">
                {tabTriggers}
            </TabsList>

			{sceneContents}
		</Tabs>
	) : (
		<EmptyState 
			icon={LazyBarChart3} 
			message="暂无场景信息" 
			description="请先创建一些卡片" 
			iconSize="xl" 
			useCard={false} 
			className="p-8 shadow-sm"
		/>
	)}
		</div>
	);
};

export default ScenePanel;

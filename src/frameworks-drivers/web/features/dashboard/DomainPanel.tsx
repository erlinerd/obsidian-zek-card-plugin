import { Card, CardContent, DashboardHeader } from '@/frameworks-drivers/shared';
import { useDashboardStore, selectDomainItems } from '@/frameworks-drivers/web';
import React from 'react';

// Domain item type
interface DomainItem {
    id: string;
    category: string;
    viewCount: number;
}

// Component props type
interface DomainStatsContainerProps {
	domainItems?: DomainItem[];
}

/**
 * DomainStatsContainer component
 * Container rendering domain statistics list with per-category counts.
 */
export const DomainStatsContainer: React.FC<DomainStatsContainerProps> = () => {
	const domainItems = useDashboardStore(selectDomainItems);
	return (
		<>
			<DashboardHeader
				title="领域统计"
				description="按类别统计的卡片分布"
			/>
			<div className="space-y-2">
				{domainItems.map((domainItem) => (
					<Card
						key={domainItem.id}
						className="ui-card ui-animate-in"
					>
						<CardContent className="p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-medium text-sm">
                                    {domainItem.category}
                                </h3>
                <p className="text-xs text-gray-500">
                    卡片数量: {domainItem.viewCount}
                </p>
                            </div>
                        </div>
						</CardContent>
					</Card>
				))}
			</div>
		</>
	);
};

export default DomainStatsContainer;

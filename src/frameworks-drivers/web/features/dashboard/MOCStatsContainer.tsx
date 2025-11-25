import React from 'react';
import { DashboardHeader, MOCItem, Button, Card, CardContent } from '@/frameworks-drivers/shared';

// MOC card interface
export interface MOCItem {
	id: string;
	name: string;
	path: string;
	lastAccessed?: Date;
}

// MOC stats container props interface
export interface MOCStatsContainerProps {
	mocItems: MOCItem[];
	loading: boolean;
	onCreateMoc: () => void;
	onOpenMocFile: (moc: MOCItem) => void;
}

/**
 * MOCStatsContainer component
 * Container for Map of Content actions and list rendering.
 */
export const MOCStatsContainer: React.FC<MOCStatsContainerProps> = ({
	mocItems,
	loading,
	onCreateMoc,
	onOpenMocFile,
}) => {
	return (
		<div className="mb-6">
			<div className="flex items-center justify-between mb-4">
				<DashboardHeader title="MOC 中心" description="内容地图管理" />
			</div>

			{mocItems.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{mocItems.map((item) => (
						<MOCItem
							key={item.id}
							item={item}
							onOpenMocFile={onOpenMocFile}
						/>
					))}
				</div>
				) : (
					<Card className="ui-card ui-animate-in">
						<CardContent className="p-6 text-center">
							<p className="text-muted-foreground">暂无 MOC 卡片</p>
                        <Button
                            variant="default"
                            size="sm"
                            className="mt-4 ui-btn"
                            onClick={onCreateMoc}
                            disabled={loading}
                        >
								创建第一个 MOC
							</Button>
						</CardContent>
					</Card>
				)}
		</div>
	);
};

export default MOCStatsContainer;

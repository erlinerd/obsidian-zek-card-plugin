/**
 * DomainList component — wrapper around shadcn ItemGroup.
 * Displays a list of domains and optional title.
 */

import React from 'react';
import { DomainItem } from './DomainItem';
import { FolderOpen } from 'lucide-react';
import EmptyState from './EmptyState';
import { ItemGroup } from '@/frameworks-drivers/shared/ui/item';
import { cn } from '@/frameworks-drivers/shared/lib/utils';

interface DomainStatistics {
	name: string;
	count: number;
}

interface DomainListProps {
	domains: DomainStatistics[];
	title?: string;
	onClick?: (domain: DomainStatistics) => void;
}

const DomainList: React.FC<DomainListProps> = ({ 
	domains, 
	title = "全部领域",
	onClick
}) => {
    // Check if domains exist
	const hasDomains = domains && domains.length > 0;

	return (
		<div className="mt-4">
			<h3 className="text-base font-medium mb-3">{title}</h3>
			{hasDomains ? (
			<ItemGroup className={cn("space-y-1")}>
				{domains.map((domain, index) => (
					<DomainItem 
						key={domain.name} 
						domain={domain} 
						index={index}
						onClick={() => onClick?.(domain)}
					/>
				))}
			</ItemGroup>
		) : (
			<EmptyState 
				icon={FolderOpen} 
				message="暂无领域" 
				description="请先创建一些卡片" 
				iconSize="lg" 
				useCard={false} 
				className={cn("p-6")}
			/>
		)}
		</div>
	);
};

export default DomainList;

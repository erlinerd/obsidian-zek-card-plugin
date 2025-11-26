/**
 * DomainItem component — wrapper around shadcn Item.
 * Displays a domain name and its card count.
 */

import React from 'react';
import { Item, ItemContent, ItemTitle } from '@/frameworks-drivers/shared/ui/item';
import { cn } from '@/frameworks-drivers/shared/lib/utils';

interface DomainStatistics {
	name: string;
	count: number;
}

interface DomainItemProps {
	domain: DomainStatistics;
	index: number;
	onClick?: () => void;
	className?: string;
	style?: React.CSSProperties;
}

export const DomainItem: React.FC<DomainItemProps> = ({
	domain,
	onClick,
	className,
}) => {
	return (
		<Item
			onClick={onClick}
			variant="muted"
			size="sm"
			className={cn("ui-item", className)}
		>
			<ItemContent className="min-w-0 flex-1">
				<ItemTitle className="text-sm font-medium truncate">
					{domain.name}
				</ItemTitle>
			</ItemContent>
			<span className="text-lg py-0.5 px-2">{domain.count}</span>
		</Item>
	);
};

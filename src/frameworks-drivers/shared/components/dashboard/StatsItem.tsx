/**
 * StatsItem component — thin wrapper around shadcn Item
 *
 * Purpose:
 * Display a single statistic with icon, title, description, and count.
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Item, ItemContent, ItemMedia, ItemTitle, ItemDescription } from '@/frameworks-drivers/shared/ui/item';

type StatCardType =
	| "primary"
	| "secondary"
	| "accent"
	| "warning"
	| "success"
	| "info";

interface StatCardProps {
	title: string;
	description: string;
	count: number;
	icon: LucideIcon;
	type?: StatCardType;
	onClick?: () => void;
}

export const StatsItem: React.FC<StatCardProps> = ({
	title,
	description,
	count,
	icon: Icon,
	onClick,
}) => {
	return (
		<Item 
			onClick={onClick}
			variant="muted"
			size="sm"
			className="group"
		>
			<ItemMedia>
				<Icon className="h-6 w-5" />
			</ItemMedia>
			<ItemContent className="flex-1 min-w-0">
				<ItemTitle className="truncate">
					{title}
				</ItemTitle>
				<ItemDescription className="text-xs truncate leading-tight">
					{description}
				</ItemDescription>
			</ItemContent>
			<span className="text-lg py-0.5 px-2">
				{count}
			</span>
		</Item>
	);
};

/**
 * SceneCardList component — wrapper around shadcn ItemGroup/Item.
 *
 * Purpose:
 * Display cards for a given scene type with appropriate icons and empty state.
 */

import React, { useMemo, useCallback } from 'react';
import { Card } from '@/frameworks-drivers/shared/ui/card';
import EmptyState from './EmptyState';
import { FileText, Lightbulb, BookOpen, Target as TargetIcon } from 'lucide-react';
import {
	ItemGroup,
	Item,
	ItemMedia,
	ItemContent,
	ItemTitle,
} from '@/frameworks-drivers/shared/ui/item';
import { cn } from '@/frameworks-drivers/shared/lib/utils';
import type { CardScene } from '@/domain/aggregates/card-note/enums/CardScene';

interface SceneCardWithMetadata {
    name: string;
    path: string;
    scene: CardScene;
}

interface SceneCardListProps {
	cards: SceneCardWithMetadata[];
	loading: boolean;
	onOpenCardFile: (card: { name: string; path: string }) => void;
	emptyMessage: string;
	title: string;
	icon: React.ComponentType<{ className?: string }>;
	iconColorClass: string;
}

export const SceneCardList: React.FC<SceneCardListProps> = React.memo(
	({
		cards,
		onOpenCardFile,
		emptyMessage,
		title,
		icon: Icon,
		iconColorClass,
	}) => {
		// Get icon by card scene type
        const getIconForCard = useCallback((card: SceneCardWithMetadata) => {
            switch (card.scene) {
                case 'idea':
                    return <Lightbulb className={cn('h-4 w-4 text-chart-3')} />;
                case 'literature':
                    return <BookOpen className={cn('h-4 w-4 text-chart-1')} />;
                case 'topic':
                    return <TargetIcon className={cn('h-4 w-4 text-chart-4')} />;
                default:
                    return <FileText className={cn('h-4 w-4 text-muted-foreground')} />;
            }
        }, []);

		// Memoize list rendering
		const cardList = useMemo(() => {
			if (cards.length === 0) {
				return (
					<EmptyState
						icon={Icon}
						message={emptyMessage}
						iconSize="md"
						useCard={false}
						className={cn("p-8")}
					/>
				);
			}

			return (
				<ItemGroup className={cn("space-y-1")}>
					{cards.map((card, index) => (
						<Item
							key={`${card.path}-${index}`}
							onClick={() =>
								onOpenCardFile({
									name: card.name,
									path: card.path,
								})
							}
							variant="muted"
							size="sm"
							className="ui-item"
						>
							<ItemMedia>{getIconForCard(card)}</ItemMedia>
							<ItemContent>
								<ItemTitle
									className={cn(
										"text-sm font-medium truncate"
									)}
								>
									{card.name}
								</ItemTitle>
							</ItemContent>
						</Item>
					))}
				</ItemGroup>
			);
		}, [cards, onOpenCardFile, emptyMessage, getIconForCard]);

		return (
			<Card className={cn("p-4 ui-card ui-animate-in")}>
				<h3 className="text-lg font-medium mb-4 flex items-center">
					<Icon className={cn(`h-5 w-5 ${iconColorClass} mr-2`)} />
					{title}
				</h3>
				{cardList}
			</Card>
		);
	}
);

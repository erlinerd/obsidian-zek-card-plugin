/**
 * CardListItem component — thin wrapper around shadcn Item
 *
 * Purpose:
 * Render a single card entry with an icon derived from its type.
 */

import React from 'react';
import {
	BookOpen,
	FileText,
	Globe,
	BookMarked,
	Lightbulb,
} from 'lucide-react';
import { Item, ItemMedia, ItemContent, ItemTitle } from '@/frameworks-drivers/shared/ui/item';

interface CardListItemProps {
	card: { name: string; path: string };
	index: number;
	cardIndex: number;
	onClick: () => void;
}

export const CardListItem: React.FC<CardListItemProps> = ({ 
	card, 
	index, 
	cardIndex, 
	onClick
}) => {
	// Resolve icon component by card type
	const getIconComponentForCard = (card: { name: string; path: string }) => {
		// Extract type from filename (expects format: name.type)
		const fileName = card.name;
		const typeMatch = fileName.match(/\.([^.]+)$/);
		const cardType = typeMatch ? typeMatch[1] : 'unknown';
		
		return getIconComponentForType(cardType);
	};

	// Map type to icon component
	const getIconComponentForType = (type: string) => {
		switch (type.toLowerCase()) {
			case 'card':
				return BookOpen;
			case 'moc':
				return BookMarked;
			case 'idea':
				return Lightbulb;
			case 'literature':
				return FileText;
			case 'topic':
				return Globe;
			default:
				return FileText;
		}
	};

	const Icon = getIconComponentForCard(card);

	return (
		<Item
			onClick={onClick}
			variant="muted"
			size="sm"
			className="group"
		>
			<ItemMedia>
				<Icon className="h-5 w-4 mr-2" />
			</ItemMedia>
			<ItemContent>
				<ItemTitle className="text-sm font-medium truncate">
					{card.name}
				</ItemTitle>
			</ItemContent>
		</Item>
	);
};

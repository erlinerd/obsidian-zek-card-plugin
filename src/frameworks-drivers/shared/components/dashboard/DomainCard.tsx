/**
 * DomainCard component
 *
 * Purpose:
 * Display a single domain with its name and a list of related cards.
 *
 * Features:
 * - Clickable domain header
 * - Shows number of cards with subtle animation
 * - Lists cards and opens them on click
 * - Empty state when domain has no cards
 */

import React from 'react';
import { Card, CardContent, CardHeader } from '@/frameworks-drivers/shared/ui/card';
import { DomainItem } from './DomainItem';
import DomainList from './DomainList';

// Domain detail interface
interface DomainDetail {
	name: string;
	cards: { name: string; path: string }[];
}

interface DomainCardProps {
	domain: DomainDetail;
	index: number;
	onOpenDomainFile: (domain: DomainDetail) => void;
	onOpenCardFile: (card: { name: string; path: string }) => void;
}

const DomainCard: React.FC<DomainCardProps> = ({
	domain,
	index,
	onOpenDomainFile,
	onOpenCardFile,
}) => {
	// Convert DomainDetail to DomainItem format
	const domainStat = {
		name: domain.name,
		count: domain.cards.length
	};

	return (
		<Card
			key={domain.name}
			className="mb-6 hover:shadow-xl"
		>
			<CardHeader className="group p-4 pb-2">
				<DomainItem 
					domain={domainStat} 
					index={index} 
					onClick={() => onOpenDomainFile(domain)}
				/>
			</CardHeader>
			<CardContent className="pt-0">
				{domain.cards.length > 0 ? (
					// Map card list to DomainList input shape
					<DomainList 
						domains={domain.cards.map(card => ({
							name: card.name,
						count: 1 // each card appears once
						}))}
						title="相关卡片"
						onClick={(cardStat) => {
							// Find the corresponding card and open it
							const card = domain.cards.find(c => c.name === cardStat.name);
							if (card) {
								onOpenCardFile(card);
							}
						}}
					/>
                    ) : (
                        <p className="text-muted-foreground text-sm">
                            此领域暂无卡片
                        </p>
                    )}
			</CardContent>
		</Card>
	);
};

export default DomainCard;

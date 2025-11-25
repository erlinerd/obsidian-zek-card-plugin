/**
 * Generic empty state component
 *
 * Purpose:
 * Show a friendly placeholder when no data is available.
 *
 * Features:
 * - Configurable icon, message, description
 * - Card and simple modes
 * - Custom styles and animations
 */

import React from 'react';
import {
	Card,
	CardContent,
}	from '@/frameworks-drivers/shared/ui/card';
import { Button } from '@/frameworks-drivers/shared/ui/button';

interface EmptyStateProps {
    icon: React.ComponentType<{ className?: string }>;
    message: string;
    description?: string;
    iconSize?: "sm" | "md" | "lg" | "xl";
    useCard?: boolean;
    className?: string;
    iconClassName?: string;
    button?: {
        label: string;
        onClick: () => void;
        icon?: React.ComponentType<{ className?: string }>;
    };
}

const iconSizeMap = {
	sm: "h-6 w-6",
	md: "h-8 w-8",
	lg: "h-10 w-10",
	xl: "h-12 w-12",
};

const EmptyState: React.FC<EmptyStateProps> = ({
	icon: Icon,
	message,
	description,
	iconSize = "xl",
	useCard = true,
	className = "",
	iconClassName = "",
	button,
}) => {
	const baseContent = (
		<div
			className={`flex flex-col items-center justify-center text-center ${className}`}
		>
			<Icon
				className={`${iconSizeMap[iconSize]} mx-auto text-muted-foreground mb-4 animate-pulse ${iconClassName}`}
			/>
			<p className="text-muted-foreground font-medium">{message}</p>
			{description && (
				<p className="text-xs text-muted-foreground mt-1">
					{description}
				</p>
			)}
			{button && (
				<div className="mt-4">
                    <Button className="ui-btn" onClick={button.onClick}>
                        {button.icon && (
                            <button.icon className="h-4 w-4 mr-2" />
                        )}
                        {button.label}
                    </Button>
				</div>
			)}
		</div>
	);

	if (useCard) {
		return (
            <Card className="ui-card ui-animate-in">
                <CardContent className="py-8">{baseContent}</CardContent>
            </Card>
		);
	}

    // Simple mode without card container
	return (
		<div className="flex items-center justify-center p-6 rounded-md bg-muted/30 border border-dashed border-border/50">
			{baseContent}
		</div>
	);
};

export default EmptyState;

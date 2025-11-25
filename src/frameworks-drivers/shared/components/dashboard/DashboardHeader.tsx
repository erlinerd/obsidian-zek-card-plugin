/**
 * DashboardHeader component
 *
 * Purpose:
 * Page header with title and optional description.
 *
 * Features:
 * - Title with dashboard icon
 * - Optional description
 * - Subtle fade-in animation
 */

import React from 'react';
import { LayoutDashboard } from 'lucide-react';

interface DashboardHeaderProps {
	title: string;
	description?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, description }) => {
	return (
		<div className="mb-6 ui-animate-in">
			<h2 className="text-2xl font-bold flex items-center">
				<LayoutDashboard className="h-6 w-6 mr-2 text-primary" />
				{title}
			</h2>
			{description && (
				<p className="text-muted-foreground text-sm mt-1">
					{description}
				</p>
			)}
		</div>
	);
};

export default DashboardHeader;

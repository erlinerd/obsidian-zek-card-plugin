import React from "react";

import { DashboardPanel } from "./features/dashboard";
import {
    ThemeProvider,
    useBodyClassObserver,
    Toaster,
    ErrorBoundary,
} from "@/frameworks-drivers/shared";

/**
 * Root application component
 *
 * Clean Architecture guidelines:
 * 1. View layer does not depend on concrete controllers/APIs
 * 2. Use dependency injection to resolve use cases
 * 3. Handle user interactions and UI rendering only
 * 4. Delegate business logic to the use case layer
 */
 

const App: React.FC = () => {
	// Observe body class changes and update theme
	useBodyClassObserver();

	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<ErrorBoundary>
				<DashboardPanel />
			</ErrorBoundary>
			<Toaster richColors />
		</ThemeProvider>
	);
};

export default App;

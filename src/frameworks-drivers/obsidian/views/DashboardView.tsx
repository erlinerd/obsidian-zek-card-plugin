import { ItemView, WorkspaceLeaf, Plugin } from 'obsidian';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { App } from '@/frameworks-drivers/web';
import { DASHBOARD_VIEW_TYPE } from './ViewConstants';

export class DashboardView extends ItemView {
    private root: ReactDOM.Root | null = null;
    plugin: Plugin;

	constructor(leaf: WorkspaceLeaf, plugin: Plugin) {
		super(leaf);
		this.plugin = plugin;
	}

	getViewType(): string {
		return DASHBOARD_VIEW_TYPE;
	}

    getDisplayText(): string {
        return "Dashboard";
    }

    async onOpen(): Promise<void> {
        const container = this.containerEl.children[1];
        container.empty();

        // Create a React root in the view container
        this.root = ReactDOM.createRoot(container);

        // Render the dashboard app
        this.root.render(React.createElement(App));
    }

    async onClose(): Promise<void> {
        // Unmount the React root and clean up
        if (this.root) {
            this.root.unmount();
            this.root = null;
        }
    }
}

export function registerDashboardView(plugin: Plugin): void {
    // Register the dashboard view type with Obsidian
    plugin.registerView(
        DASHBOARD_VIEW_TYPE,
        (leaf) => new DashboardView(leaf, plugin as any)
    );
}

export function detachDashboardView(plugin: Plugin): void {
    // Detach all leaves of the dashboard view type
    plugin.app.workspace.detachLeavesOfType(DASHBOARD_VIEW_TYPE);
}

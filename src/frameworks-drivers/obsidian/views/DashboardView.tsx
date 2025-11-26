import { ItemView, WorkspaceLeaf, Plugin } from "obsidian";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { App } from "@/frameworks-drivers/web";
import { DASHBOARD_VIEW_TYPE } from "./ViewConstants";

export class DashboardView extends ItemView {
	private root: ReactDOM.Root | null = null;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType(): string {
		return DASHBOARD_VIEW_TYPE;
	}

	getDisplayText(): string {
		return "Dashboard";
	}

	async onOpen() {
		const container = this.containerEl.children[1];
		container.empty();

		// Create a React root in the view container
		this.root = ReactDOM.createRoot(container);

		// Render the dashboard app
		await this.root.render(React.createElement(App));
	}

	async onClose() {
		// Unmount the React root and clean up
		if (this.root) {
			await this.root.unmount();
			this.root = null;
		}
	}
}

export function registerDashboardView(plugin: Plugin): void {
	// Register the dashboard view type with Obsidian
	plugin.registerView(DASHBOARD_VIEW_TYPE, (leaf) => new DashboardView(leaf));
}

export function detachDashboardView(plugin: Plugin): void {
	// Detach all leaves of the dashboard view type
	plugin.app.workspace.detachLeavesOfType(DASHBOARD_VIEW_TYPE);
}

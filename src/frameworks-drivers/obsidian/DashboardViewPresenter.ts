import { DASHBOARD_VIEW_TYPE } from './views/ViewConstants';
import type { Plugin } from 'obsidian';

/**
 * Presenter responsible for opening or activating the dashboard view.
 */
export class DashboardViewPresenter {
    plugin: Plugin;

    constructor(plugin: Plugin) {
        this.plugin = plugin;
    }

    /**
     * Reveal the dashboard view in the right sidebar. If the view doesn't exist,
     * create it and set its view state to `DASHBOARD_VIEW_TYPE`.
     */
    public async openDashboardView(): Promise<void> {
        const leaf =
            this.plugin.app.workspace.getLeavesOfType(
                DASHBOARD_VIEW_TYPE
            )[0] || this.plugin.app.workspace.getRightLeaf(false);

        if (!leaf) {
            return;
        }

        if (!leaf.view || leaf.view.getViewType() !== DASHBOARD_VIEW_TYPE) {
            await leaf.setViewState({ type: DASHBOARD_VIEW_TYPE });
        }

        this.plugin.app.workspace.revealLeaf(leaf).catch(() => {});
    }
}

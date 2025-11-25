import { Plugin } from "obsidian";
import { DashboardViewPresenter } from "@/frameworks-drivers/obsidian/DashboardViewPresenter";

/**
 * Register a ribbon icon in Obsidian that opens the dashboard view.
 *
 * - Icon: `boom-box`
 * - Title: `zek-card`
 * - Action: Instantiate `DashboardViewPresenter` and reveal the dashboard view
 */
export function registerRibbonIcon(plugin: Plugin): void {
    plugin.addRibbonIcon(
        "boom-box",
        "zek-card",
        (_evt: MouseEvent) => {
            new DashboardViewPresenter(plugin).openDashboardView();
        }
    );
}

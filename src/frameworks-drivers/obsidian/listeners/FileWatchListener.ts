import { useDashboardStore } from '@/frameworks-drivers/web';
import { debounce, Plugin } from 'obsidian';

/**
 * Register vault file watchers and refresh dashboard data with debounce.
 */
export function registerFileWatchListeners(plugin: Plugin) {
    const debouncedFn = debounce(() => {
        useDashboardStore.getState().fetchCards().catch(() => {});
    }, 500);

    // File created
    plugin.registerEvent(
        plugin.app.vault.on("create", () => {
            debouncedFn();
        })
    );

    // File modified
    plugin.registerEvent(
        plugin.app.vault.on("modify", () => {
            debouncedFn();
        })
    );

    // File deleted
    plugin.registerEvent(
        plugin.app.vault.on("delete", () => {
            debouncedFn();
        })
    );
}

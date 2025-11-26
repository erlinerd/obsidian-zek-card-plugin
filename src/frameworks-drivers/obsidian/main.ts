import "reflect-metadata";
import { Plugin } from "obsidian";
import {
	registerRibbonIcon,
	registerFileWatchListeners,
	registerEditorMenuListeners,
	registerDashboardView,
} from "@/frameworks-drivers/obsidian";
import "@/frameworks-drivers/shared/styles/index.css";
import { bootstrap } from "@/application/bootstrap";
import { container } from "tsyringe";
/**
 * Plugin entry class using Clean Architecture structure.
 */
export default class ZekCardPlugin extends Plugin {
	onload() {
		bootstrap(this);

		registerRibbonIcon(this);
		registerFileWatchListeners(this);
		registerEditorMenuListeners(this);
		registerDashboardView(this);
	}

	onunload() {
		container.reset();
	}
}

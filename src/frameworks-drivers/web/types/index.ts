/**
 * View-layer type definitions used by UI components
 */

/**
 * Card type enum — mirrors domain `CardScene`.
 */
export enum SceneType {
  LITERATURE = "literature",
  IDEA = "idea",
  TOPIC = "topic",
}

/** Scene statistics */
export type SceneStatistics = Record<string, number>;

/** Scene card metadata */
export interface SceneCardWithMetadata {
  name: string;
  path: string;
  metadata?: any;
}

/** ScenePanel props */
export interface ScenePanelProps {
  scenes?: string[];
  activeScene?: string;
  onSceneChange?: (scene: string) => void;
  sceneStatistics?: SceneStatistics;
  sceneCards?: Record<SceneType, SceneCardWithMetadata[]>;
  loading?: boolean;
  onOpenCardFile?: (card: { name: string; path: string }) => void;
}

/** Controller-related types */
export interface CardController {
  createMocCard(): Promise<void>;
}

export interface DashboardViewController {
  getCardCount(): Promise<number>;
  getDomainDetails(): Promise<any[]>;
  getCardTypeStatistics(): Promise<any>;
  getSceneStatistics(): Promise<SceneStatistics>;
  getMocCards(): Promise<any[]>;
}

export interface SceneController {
  getAllSceneCardsByType(): Promise<Record<SceneType, SceneCardWithMetadata[]>>;
}

/** Domain detail */
export interface DomainDetail {
  name: string;
  cards: any[];
}

/** Card type statistics */
export interface CardTypeDetail {
  total: number;
  card: number;
  moc: number;
}
import type { CardScene } from "@/domain/aggregates/card-note/enums/CardScene";

export interface CardListItemDTO {
  name: string;
  path: string;
  scene: CardScene;
  domain: string[];
}

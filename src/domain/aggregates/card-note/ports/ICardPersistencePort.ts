import { CardScene } from "@/domain/aggregates/card-note/enums/CardScene";

export interface CardData {
    title: string;
    content: string;
    scene: CardScene;
    source: string[];
    domain: string[];
}

export interface CardSaveResult {
    path: string;
}

export interface CardListItem {
    name: string;
    path: string;
    scene: CardScene;
    domain: string[];
}

export interface ICardPersistencePort {
    saveCard(cardData: CardData): Promise<CardSaveResult>;
    exists(path: string): Promise<boolean>;
    open(path: string): Promise<void>;
    listAllCards(): Promise<CardListItem[]>;
}

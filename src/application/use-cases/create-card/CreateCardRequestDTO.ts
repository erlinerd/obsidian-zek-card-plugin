import { CardScene } from "@/domain/aggregates/card-note/enums/CardScene";

export interface CreateCardRequestDTO {
  sourceFileName: string;
  sourceText: string;
  scene: CardScene;
}

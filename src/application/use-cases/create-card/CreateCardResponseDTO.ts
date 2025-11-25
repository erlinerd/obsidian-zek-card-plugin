import { CardScene } from "@/domain/aggregates/card-note/enums/CardScene";

export interface CreateCardResponseDTO {
  title: string;
  content: string;
  scene: CardScene;
  source: string[];
  domain: string[];
  filePath: string;
  existed: boolean;
}

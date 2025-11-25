import { Template } from "@/domain/aggregates/template/Template";
export interface ITemplateRepository {
    getByFileName(fileName: string): Promise<Template | null>;
}

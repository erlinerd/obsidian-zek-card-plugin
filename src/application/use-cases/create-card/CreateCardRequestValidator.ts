import { CreateCardRequestDTO } from "@/application/use-cases/create-card/CreateCardRequestDTO";
import { DomainError } from "@/domain/errors/DomainError";

/**
 * Validate and normalize incoming create-card request.
 *
 * Responsibilities:
 * - Trim `sourceFileName` and `sourceText`
 * - Ensure `sourceFileName` is present; throw `DomainError` otherwise
 * - Preserve `scene` for downstream strategy resolution
 */
export function validateCreateCardRequest(dto: CreateCardRequestDTO): CreateCardRequestDTO {
  const scene = dto.scene;
  const sourceFileName = (dto.sourceFileName ?? "").trim();
  const sourceText = (dto.sourceText ?? "").trim();
  if (!sourceFileName) {
    throw new DomainError("INVALID_SOURCE_FILE_NAME", "sourceFileName不能为空");
  }
  return { scene, sourceFileName, sourceText };
}

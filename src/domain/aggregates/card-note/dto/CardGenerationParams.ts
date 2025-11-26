
/**
 * Unified parameters for card generation — enforce consistent strategy inputs
 */
export interface CardGenerationParams {
    sourceText: string; // source text (user input)
    sourceFileName: string; // source file name (helps avoid duplicate titles)
}

export const CardScene = {
	IDEA: "idea",
	LITERATURE: "literature",
	TOPIC: "topic",
} as const;

export type CardScene = (typeof CardScene)[keyof typeof CardScene];

/** Validate card scene input (string-compatible type guard) */
export function isValidCardScene(input: string): input is CardScene {
    return Object.values(CardScene).includes(input as CardScene);
}

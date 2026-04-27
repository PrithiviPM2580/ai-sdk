export const MODELS = {
  TOOL: "z-ai/glm-4.5-air:free",
} as const

export type ModelKey = keyof typeof MODELS

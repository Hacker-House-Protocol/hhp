export const LANGUAGES = [
  "English",
  "Spanish",
  "Portuguese",
  "French",
  "Chinese",
  "Japanese",
  "Korean",
  "German",
  "Arabic",
  "Hindi",
] as const

export type Language = (typeof LANGUAGES)[number]

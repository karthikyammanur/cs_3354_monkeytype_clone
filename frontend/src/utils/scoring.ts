export function calculateWPM(correctChars: number, durationSeconds: number): number {
  if (durationSeconds <= 0) return 0;
  return Math.round((correctChars / 5) / (durationSeconds / 60));
}

export function calculateAccuracy(correctChars: number, totalChars: number): number {
  if (totalChars <= 0) return 0;
  return Math.round((correctChars / totalChars) * 1000) / 10;
}

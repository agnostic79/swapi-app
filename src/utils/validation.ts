export function isValidField(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length >= 4 && trimmed.length <= 30;
}

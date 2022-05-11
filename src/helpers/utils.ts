export function trimLongDescription(
  description: string,
  maxLen: number
): string {
  return description.length <= maxLen
    ? description
    : `${description.substring(0, maxLen)}...`;
}

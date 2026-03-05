/**
 * Generate a dietitian invite code in format: DYT-XXXX-XXXX
 * Characters: uppercase letters + digits, excluding confusing chars (0/O, 1/I/L)
 */
const SAFE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function randomPart(length: number): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += SAFE_CHARS[Math.floor(Math.random() * SAFE_CHARS.length)];
  }
  return result;
}

export function generateInviteCode(firstName: string): string {
  const namePrefix = firstName
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, 4)
    .padEnd(4, "X");
  return `DYT-${namePrefix}-${randomPart(4)}`;
}

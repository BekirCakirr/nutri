// Deterministic, gender-aware avatar URLs for demo accounts.
// Female pravatar img IDs: 1, 5, 9, 16, 19, 23, 24, 25, 26, 32, 36, 38, 41, 44, 47, 49
// Male:                    3, 7, 8, 11, 12, 13, 14, 15, 17, 22, 33, 51, 52, 53, 54

const FEMALE_KEYWORDS = [
  "ayse", "ayşe", "elif", "fatma", "zeynep", "selin", "meryem", "sevgi",
  "gul", "gül", "aysel", "demo", "yeni",
];

const FEMALE_IMGS = [1, 5, 9, 16, 19, 23, 24, 25, 26, 32, 36, 38, 41, 44, 47, 49];
const MALE_IMGS = [3, 7, 8, 11, 12, 13, 14, 15, 17, 22, 33, 51, 52, 53, 54];

const SPECIFIC: Record<string, number> = {
  "ayse": 5,
  "ayşe": 5,
  "ayse.yilmaz": 5,
  "ayse yilmaz": 5,
  "elif": 1,
  "elif.kaya": 1,
  "elif kaya": 1,
  "fatma": 9,
  "zeynep": 16,
  "mehmet": 12,
  "ahmet": 11,
  "ali": 14,
  "selin": 23,
};

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function isFemale(seed: string): boolean {
  const lower = seed.toLowerCase();
  return FEMALE_KEYWORDS.some((k) => lower.includes(k));
}

export function avatarFor(seed: string | undefined | null, size = 300): string {
  const key = String(seed ?? "").trim().toLowerCase();
  if (!key) return `https://i.pravatar.cc/${size}?img=10`;

  if (SPECIFIC[key] !== undefined) {
    return `https://i.pravatar.cc/${size}?img=${SPECIFIC[key]}`;
  }
  for (const k of Object.keys(SPECIFIC)) {
    if (key.includes(k)) {
      return `https://i.pravatar.cc/${size}?img=${SPECIFIC[k]}`;
    }
  }

  const list = isFemale(key) ? FEMALE_IMGS : MALE_IMGS;
  const img = list[hashStr(key) % list.length];
  return `https://i.pravatar.cc/${size}?img=${img}`;
}

/**
 * Format a number with locale-aware separators
 */
export function formatNumber(value: number, decimals = 0): string {
  return value.toLocaleString('tr-TR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format calories display: "1.250 kcal"
 */
export function formatCalories(value: number): string {
  return `${formatNumber(Math.round(value))} kcal`;
}

/**
 * Format weight: "72,5 kg"
 */
export function formatWeight(value: number): string {
  return `${formatNumber(value, 1)} kg`;
}

/**
 * Format water intake: "1.500 ml" or "1,5 L"
 */
export function formatWater(ml: number, asLiters = false): string {
  if (asLiters) {
    return `${formatNumber(ml / 1000, 1)} L`;
  }
  return `${formatNumber(ml)} ml`;
}

/**
 * Format grams: "25 g"
 */
export function formatGrams(value: number, decimals = 0): string {
  return `${formatNumber(value, decimals)} g`;
}

/**
 * Format percentage: "%65"
 */
export function formatPercent(value: number): string {
  return `%${Math.round(value)}`;
}

/**
 * Format date to Turkish locale: "25 \u015eubat 2026"
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Format short date: "25 \u015eub"
 */
export function formatShortDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
  });
}

/**
 * Format time: "14:30"
 */
export function formatTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format relative time: "2 saat \u00f6nce", "5 dk \u00f6nce"
 */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return 'Az \u00f6nce';
  if (diffMin < 60) return `${diffMin} dk \u00f6nce`;
  if (diffHour < 24) return `${diffHour} saat \u00f6nce`;
  if (diffDay < 7) return `${diffDay} g\u00fcn \u00f6nce`;
  return formatDate(d);
}

/**
 * Format duration in minutes: "1s 30dk"
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} dk`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}s ${m}dk` : `${h}s`;
}

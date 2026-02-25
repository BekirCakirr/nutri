// ---------------------------------------------------------------------------
// Date Utility Functions (date-fns)
// ---------------------------------------------------------------------------

import {
  format,
  formatDistanceToNow,
  isToday as isTodayFns,
  isTomorrow as isTomorrowFns,
  isYesterday as isYesterdayFns,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addDays,
  addWeeks,
  addMonths,
  subDays,
  subWeeks,
  subMonths,
  differenceInYears,
  differenceInDays,
  parseISO,
  isValid,
  startOfMonth,
  endOfMonth,
  isBefore,
  isAfter,
  isSameDay,
  setHours,
  setMinutes,
} from "date-fns";
import { tr } from "date-fns/locale";

// ── Formatting ───────────────────────────────────────────────────────────────

/** Format a date string or Date into a human-readable date. */
export function formatDate(date: string | Date, pattern = "dd MMM yyyy"): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(d)) return "";
  return format(d, pattern, { locale: tr });
}

/** Format a date with time. */
export function formatDateTime(date: string | Date): string {
  return formatDate(date, "dd MMM yyyy HH:mm");
}

/** Format time only (HH:mm). */
export function formatTime(date: string | Date): string {
  return formatDate(date, "HH:mm");
}

/** Relative time string (e.g. "3 dakika once"). */
export function getRelativeTime(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(d)) return "";
  return formatDistanceToNow(d, { addSuffix: true, locale: tr });
}

/** Get a friendly label: "Bugun", "Dun", "Yarin", or formatted date. */
export function getFriendlyDate(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(d)) return "";
  if (isTodayFns(d)) return "Bugun";
  if (isYesterdayFns(d)) return "Dun";
  if (isTomorrowFns(d)) return "Yarin";
  return formatDate(d);
}

// ── Checks ───────────────────────────────────────────────────────────────────

/** Whether a date is today. */
export function isToday(date: string | Date): boolean {
  const d = typeof date === "string" ? parseISO(date) : date;
  return isValid(d) && isTodayFns(d);
}

/** Whether a date is in the past. */
export function isPast(date: string | Date): boolean {
  const d = typeof date === "string" ? parseISO(date) : date;
  return isValid(d) && isBefore(d, new Date());
}

/** Whether a date is in the future. */
export function isFuture(date: string | Date): boolean {
  const d = typeof date === "string" ? parseISO(date) : date;
  return isValid(d) && isAfter(d, new Date());
}

/** Whether two dates fall on the same calendar day. */
export function areSameDay(a: string | Date, b: string | Date): boolean {
  const da = typeof a === "string" ? parseISO(a) : a;
  const db = typeof b === "string" ? parseISO(b) : b;
  return isSameDay(da, db);
}

// ── Ranges ───────────────────────────────────────────────────────────────────

/** Get all days in the current week (Monday-start). */
export function getWeekDays(date: Date = new Date()): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
}

/** Get start and end dates for a given range. */
export function getDateRange(
  range: "today" | "week" | "month" | "custom",
  customStart?: Date,
  customEnd?: Date,
): { start: Date; end: Date } {
  const now = new Date();
  switch (range) {
    case "today":
      return { start: now, end: now };
    case "week":
      return {
        start: startOfWeek(now, { weekStartsOn: 1 }),
        end: endOfWeek(now, { weekStartsOn: 1 }),
      };
    case "month":
      return { start: startOfMonth(now), end: endOfMonth(now) };
    case "custom":
      return {
        start: customStart ?? now,
        end: customEnd ?? now,
      };
  }
}

/** Return an array of Date objects for every day in an interval. */
export function getDaysInRange(start: Date, end: Date): Date[] {
  return eachDayOfInterval({ start, end });
}

// ── Arithmetic ───────────────────────────────────────────────────────────────

export { addDays, addWeeks, addMonths, subDays, subWeeks, subMonths };

// ── Age ──────────────────────────────────────────────────────────────────────

/** Calculate age from a date-of-birth string. */
export function calculateAge(dateOfBirth: string | Date): number {
  const d = typeof dateOfBirth === "string" ? parseISO(dateOfBirth) : dateOfBirth;
  return differenceInYears(new Date(), d);
}

/** Days remaining until a target date. */
export function daysUntil(target: string | Date): number {
  const d = typeof target === "string" ? parseISO(target) : target;
  return differenceInDays(d, new Date());
}

// ── Time Slot Generation ─────────────────────────────────────────────────────

/**
 * Generate time slots for a given day.
 *
 * @param date        Base date
 * @param startHour   Start hour (0-23)
 * @param endHour     End hour (0-23)
 * @param intervalMin Interval in minutes (default 30)
 * @returns Array of Date objects for each slot
 */
export function generateTimeSlots(
  date: Date,
  startHour: number,
  endHour: number,
  intervalMin = 30,
): Date[] {
  const slots: Date[] = [];
  let current = setMinutes(setHours(date, startHour), 0);
  const end = setMinutes(setHours(date, endHour), 0);

  while (isBefore(current, end)) {
    slots.push(current);
    current = addDays(current, 0); // clone
    current = new Date(current.getTime() + intervalMin * 60_000);
  }

  return slots;
}

// ── Parsing ──────────────────────────────────────────────────────────────────

/** Safely parse an ISO string. Returns `null` on invalid input. */
export function safeParse(dateStr: string): Date | null {
  const d = parseISO(dateStr);
  return isValid(d) ? d : null;
}

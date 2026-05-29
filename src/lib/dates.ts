const DATE_ONLY_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const TOUR_API_DATE_RE = /^(\d{4})(\d{2})(\d{2})$/;

export function isValidDate(value: Date | null | undefined): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime());
}

export function parseKoreaDateInput(value?: string | null, endOfDay = false): Date | null {
  if (!value) return null;

  const match = value.trim().match(DATE_ONLY_RE);
  if (!match) return null;

  const [, year, month, day] = match;
  const date = new Date(`${year}-${month}-${day}T${endOfDay ? "23:59:59" : "00:00:00"}+09:00`);
  if (!isValidDate(date)) return null;

  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() + 1 !== Number(month) ||
    date.getDate() !== Number(day)
  ) {
    return null;
  }

  return date;
}

export function parseTourApiDate(value?: string | null, endOfDay = false): Date | null {
  if (!value) return null;

  const match = value.trim().match(TOUR_API_DATE_RE);
  if (!match) return null;

  const [, year, month, day] = match;
  return parseKoreaDateInput(`${year}-${month}-${day}`, endOfDay);
}

export function parseDateRangeInput(value?: string | null): { startDate: Date; endDate: Date } | null {
  if (!value) return null;

  const [rawStart, rawEnd] = value.split("~").map((part) => part?.trim());
  const startDate = parseKoreaDateInput(rawStart);
  const endDate = parseKoreaDateInput(rawEnd || rawStart, true);

  if (!startDate || !endDate) return null;

  return normalizeDateRange(startDate, endDate);
}

export function normalizeDateRange(startDate: Date, endDate: Date) {
  if (!isValidDate(startDate) || !isValidDate(endDate)) return null;

  if (startDate <= endDate) {
    return { startDate, endDate };
  }

  return { startDate: endDate, endDate: startDate };
}

export function getFestivalNow() {
  const override = process.env.FESTIVAL_NOW;
  const overriddenDate = override ? new Date(override) : null;

  return isValidDate(overriddenDate) ? overriddenDate : new Date();
}

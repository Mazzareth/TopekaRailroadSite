export type EventDateFields = {
  date?: string;
  startDate?: string;
  endDate?: string;
};

export function eventStartDate(event: EventDateFields): string {
  return event.startDate || event.date || "";
}

export function eventEndDate(event: EventDateFields): string {
  return event.endDate || eventStartDate(event);
}

function formatDateParts(date: string) {
  const dt = new Date(`${date}T12:00:00`);
  return {
    month: dt.toLocaleDateString("en-US", { month: "short" }),
    day: dt.toLocaleDateString("en-US", { day: "numeric" }),
    year: dt.toLocaleDateString("en-US", { year: "numeric" }),
  };
}

export function fmtEventDateRange(event: EventDateFields, includeYear = false): string {
  const start = eventStartDate(event);
  if (!start) return "—";

  const end = eventEndDate(event);
  const startParts = formatDateParts(start);
  const endParts = formatDateParts(end);
  const year = includeYear ? `, ${startParts.year}` : "";

  if (!end || end === start) {
    return `${startParts.month} ${startParts.day}${year}`;
  }

  if (startParts.year === endParts.year && startParts.month === endParts.month) {
    return `${startParts.month} ${startParts.day}-${endParts.day}${includeYear ? `, ${startParts.year}` : ""}`;
  }

  const range = `${startParts.month} ${startParts.day}-${endParts.month} ${endParts.day}`;
  return includeYear && startParts.year === endParts.year
    ? `${range}, ${startParts.year}`
    : `${range}${includeYear ? `, ${endParts.year}` : ""}`;
}

export function normalizeEventDates<T extends EventDateFields>(event: T): T & { date: string; startDate: string; endDate: string } {
  const startDate = eventStartDate(event);
  const endDate = event.endDate || startDate;
  return { ...event, date: startDate, startDate, endDate };
}

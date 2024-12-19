import { differenceInDays, parseISO, formatDistance } from "date-fns";

export const subtractDates = (
  dateStr1: string | Date,
  dateStr2: string | Date
): number =>
  differenceInDays(parseISO(String(dateStr1)), parseISO(String(dateStr2)));

// Format the distance of a given date from now, omitting 'about' and adjusting 'in'
export const formatDistanceFromNow = (date: Date | string) => {
  const parsedDate = typeof date === "string" ? parseISO(date) : date;
  return formatDistance(parsedDate, new Date(), {
    addSuffix: true,
  })
    .replace("about ", "")
    .replace("in", "In");
};

export const getToday = (options: { end?: boolean } = {}): string => {
  const today = new Date();

  if (options?.end)
    // Set to the last second of the day
    today.setUTCHours(23, 59, 59, 999);
  else today.setUTCHours(0, 0, 0, 0);

  return today.toISOString();
};

// Format a number into USD currency
export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("en", { style: "currency", currency: "USD" }).format(
    value
  );

export const generateGridTemplateColumns = (columns: string[]) => {
  const cols = columns
    .map((col: string) => col)
    .join(" ")
    .replaceAll(",", "");
  return cols;
};

export function getTagName(status: string): string {
  const statusToTagName = {
    completed: "blue",
    active: "green",
    inactive: "silver",
    pending: "silver",
    accepted: "green",
  };

  type Status = keyof typeof statusToTagName;
  return statusToTagName[status as Status];
}

export function formatNumber(num: number) {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "m";
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num?.toString();
}

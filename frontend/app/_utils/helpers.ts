import { differenceInDays, parseISO, formatDistance } from "date-fns";

export const subtractDates = (
  dateStr1: string | Date,
  dateStr2: string | Date
): number =>
  differenceInDays(parseISO(String(dateStr1)), parseISO(String(dateStr2)));

// Format the distance of a given date from now, omitting 'about' and adjusting 'in'
export const formatDistanceFromNow = (dateStr: string): string =>
  formatDistance(new Date(dateStr), new Date(), {
    addSuffix: true,
  })
    .replace("about ", "")
    .replace("in", "In");

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
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  };

  type Status = keyof typeof statusToTagName;
  return statusToTagName[status as Status];
}

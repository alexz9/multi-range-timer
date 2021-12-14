import { IMutableRange, IRange } from "../types";
import isValidDate from "./isValidDate";
import toDate from "./toDate";

export default function toValidRanges(ranges: IRange[]): IMutableRange[] {
  if (!Array.isArray(ranges)) {
    throw new Error("Ranges is not array");
  }

  const res: IMutableRange[] = ranges.map((item, i) => {
    if (!item.end && !isValidDate(item.start)) {
      throw new Error(`Start date is not valid in range with index ${i}`);
    }
    if (!item.end || !isValidDate(item.end)) {
      throw new Error(`End date is not valid in range with index ${i}`);
    }

    const start = toDate(item.start);
    const end = toDate(item.end);

    if(start.getTime() > end.getTime()){
      throw new Error(`Start date must be less than end date in range with index ${i}`);
    }

    return { ...item, start, end };
  });
  // проверить, должна быть сортировка по возрастанию времени end
  res.sort((a, b) => a.start.getTime() - b.start.getTime());
  return res;
}
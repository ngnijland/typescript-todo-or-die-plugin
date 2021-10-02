import { ConfigOptions, Validation } from "./types";
import { getWarningPeriod, isValidDate } from "./utils";

const getAfterDateIssue = (
  date: string,
  options?: ConfigOptions
): Validation => {
  const dateParam = new Date(date).getTime() / 1000;
  const now = new Date().getTime() / 1000;
  const warningOption = options?.after_date?.warn;

  if (now > dateParam) {
    return {
      error: true,
      message: "It's time to do it!",
      category: "error",
    };
  }

  if (warningOption && dateParam - now < getWarningPeriod(warningOption)) {
    return {
      error: true,
      message: "Get ready, time is short!",
      category: "warning",
    };
  }

  return {
    error: false,
  };
};

export function after_date(date: string, options?: ConfigOptions): Validation {
  if (isValidDate(date)) {
    return getAfterDateIssue(date, options);
  }

  return {
    error: false,
  };
}

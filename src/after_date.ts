import { ConfigOptions, Validation } from './types';
import { getWarningPeriod } from './utils'

export function after_date(date: string, options?: ConfigOptions): Validation {
  const now = new Date().getTime() / 1000;
  const dateParam = new Date(date).getTime() / 1000;
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
}

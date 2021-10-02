import { Periods } from "./types";

const periods: Periods = {
  w: 604800,
  d: 86400,
  h: 3600,
};

export const isValidWarnOption = (option: string): string | boolean => {
  return option.match(/^\d+[w|d|h]$/) ? option : false;
};

export const parseWarnOption = (option: string): [number, keyof Periods] => {
  if (!isValidWarnOption(option)) {
    return [1, "w"];
  }

  const interval = option.charAt(option.length - 1) as keyof Periods;
  const multipler = parseInt(option.substring(0, option.length - 1), 10);

  return [multipler, interval];
};

export const getWarningPeriod = (warnOption: string | true): number => {
  if (warnOption === true) {
    return periods["w"];
  }

  const [multipler, interval] = parseWarnOption(warnOption);

  return multipler * periods[interval];
};



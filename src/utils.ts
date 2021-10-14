import * as fs from "fs";
import { Periods, Levels } from "./types";

const periods: Periods = {
  w: 604800,
  d: 86400,
  h: 3600,
};

const levels: Levels = {
  M: 0,
  m: 1,
  p: 2,
};

export const isValidDate = (date: string): boolean => {
  //const regex = new RegExp(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)

  //return regex.test(date)
  const [year] = date.split("-");
  return year.length === 4;
};

export const isValidWarnOption = (option: string): string | boolean => {
  return option.match(/^\d+[w|d|h]$/) ? option : false;
};

export const isValidWarnWhenOption = (option: string): boolean => {
  return option.match(/^\d+[M|m|p]$/) ? true : false;
};

export const parseOption = (option: string): [number, string] => [
  parseInt(option.substring(0, option.length - 1), 10),
  option.charAt(option.length - 1),
];

export const parseWarnOption = (option: string): [number, keyof Periods] => {
  if (!isValidWarnOption(option)) {
    return [1, "w"];
  }

  const [multipler, interval] = parseOption(option);

  return [multipler, interval as keyof Periods];
};

export const parseWarnWhenOption = (option: string): [number, number] => {
  if (!isValidWarnWhenOption(option)) {
    return [1, levels["p"]];
  }

  const [versionAhead, level] = parseOption(option);

  return [versionAhead, levels[level as keyof Levels]];
};

export const getWarningPeriod = (warnOption: string | true): number => {
  if (warnOption === true) {
    return periods["w"];
  }

  const [multipler, interval] = parseWarnOption(warnOption);

  return multipler * periods[interval];
};

export const startsWithKeyword = (
  todo: string,
  keywords: string[]
): boolean => {
  return keywords.some((keyword) => {
    return todo.startsWith(`// ${keyword}::`);
  });
};

export const getWarningWhen = (warnOption: string | true): [number, number] => {
  if (warnOption === true) {
    return [1, levels["p"]];
  }

  return parseWarnWhenOption(warnOption);
};

export const getSplitPackageVersion = (version: string): number[] => {
  return version.split(".").map((n) => parseInt(n, 10));
};

export const getJsonFromFile = (
  filepath: string
): Record<string, any> | null => {
  try {
    const file = fs.readFileSync(filepath);
    // @ts-ignore
    const data = JSON.parse(file);

    return data;
  } catch (_e) {
    return null;
  }
};

export const pipe = <T extends any[]>(
  fn: (...args: T) => any,
  ...fns: Array<(a: any) => any>
) => {
  const piped = fns.reduce(
    (prevFn, nextFn) => (value: any) => nextFn(prevFn(value)),
    (value) => value
  );
  return (...args: T) => piped(fn(...args));
};

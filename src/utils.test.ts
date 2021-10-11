import {
  isValidDate,
  isValidWarnOption,
  parseWarnOption,
  getWarningPeriod,
  isValidWarnWhenOption,
  parseOption,
  parseWarnWhenOption,
  getWarningWhen,
  getSplitPackageVersion,
  pipe
} from "./utils";

test("isValidDate", () => {
  const date = "2021-12-05";
  const res = isValidDate(date);

  expect(res).toBe(true);
});

test("isValidDate invalidates wrong format", () => {
  const date = "20-06-2021";
  const res = isValidDate(date);

  expect(res).toBe(false);
});

test("isValidDate invalidates no format", () => {
  const date = "20062021";
  const res = isValidDate(date);

  expect(res).toBe(false);
});

test("isValidDate invalidates empty", () => {
  const date = "";
  const res = isValidDate(date);

  expect(res).toBe(false);
});

test("isValidWarnOption validates", () => {
  const validWeeks = "1w";
  const validDays = "20d";
  const validHours = "24h";
  const resultW = isValidWarnOption(validWeeks);
  const resultD = isValidWarnOption(validDays);
  const resultH = isValidWarnOption(validHours);

  expect(resultW).toBe(validWeeks);
  expect(resultD).toBe(validDays);
  expect(resultH).toBe(validHours);
});

test("isValidWarnOption invalidates", () => {
  const invalid1 = "rew";
  const invalid2 = "";
  const invalid3 = "20g";
  const result1 = isValidWarnOption(invalid1);
  const result2 = isValidWarnOption(invalid2);
  const result3 = isValidWarnOption(invalid3);

  expect(result1).toBe(false);
  expect(result2).toBe(false);
  expect(result3).toBe(false);
});

test("isValidWarnWhenOption validates", () => {
  const option1 = "1M";
  const option2 = "2m";
  const option3 = "3p";

  expect(isValidWarnWhenOption(option1)).toBe(true);
  expect(isValidWarnWhenOption(option2)).toBe(true);
  expect(isValidWarnWhenOption(option3)).toBe(true);
});

test("isValidWarnWhenOption invalidates", () => {
  const option1 = "reg";
  const option2 = "";
  const option3 = "3g";

  expect(isValidWarnWhenOption(option1)).toBe(false);
  expect(isValidWarnWhenOption(option2)).toBe(false);
  expect(isValidWarnWhenOption(option3)).toBe(false);
});

test("parseOption", () => {
  const dateOption = "20d";
  const versionOption = "2M";
  expect(parseOption(dateOption)).toStrictEqual([20, "d"]);
  expect(parseOption(versionOption)).toStrictEqual([2, "M"]);
});

test("parseWarnOption", () => {
  const opt = "23h";
  const [multipler, interval] = parseWarnOption(opt);

  expect(multipler).toBe(23);
  expect(interval).toBe("h");
});

test("parseWarnOption with wrong option", () => {
  const opt = "5x";
  const [multipler, interval] = parseWarnOption(opt);

  expect(multipler).toBe(1);
  expect(interval).toBe("w");
});

test("parseWarnWhenOption", () => {
  const option1 = "1M";
  const option2 = "2m";
  const option3 = "10p";

  expect(parseWarnWhenOption(option1)).toStrictEqual([1, 0]);
  expect(parseWarnWhenOption(option2)).toStrictEqual([2, 1]);
  expect(parseWarnWhenOption(option3)).toStrictEqual([10, 2]);
});

test("getWarningPeriod with true", () => {
  const option = true;
  const res = getWarningPeriod(option);

  expect(res).toBe(604800);
});

test("getWarningPeriod with interval option", () => {
  const option = "1h";
  const res = getWarningPeriod(option);

  expect(res).toBe(3600);
});

test('getWarningWhen', () => {
  const option1 = true
  const option2 = '2m'

  expect(getWarningWhen(option1)).toStrictEqual([1, 2])
  expect(getWarningWhen(option2)).toStrictEqual([2, 1])
})

test('getSplitPackageVersion', () => {
  const p = '1.2.3'
  expect(getSplitPackageVersion(p)).toStrictEqual([1, 2, 3])
})

test('pipe', () => {
  const fn1 = (a:  number, b: number) => a + b
  const fn2 = (s:  number) => s*2

  const pipeline = pipe(fn1, fn2)

  expect(pipeline(1, 2)).toStrictEqual(6)
})

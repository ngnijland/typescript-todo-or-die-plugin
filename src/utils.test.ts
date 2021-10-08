import {
  getWarningPeriod,
  isValidDate,
  isValidWarnOption,
  parseWarnOption,
  startsWithKeyword,
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

test("startsWithKeyword returns true on lines that start with keywords", () => {
  const keywords = ["TODO", "FIXME"];

  const validLine1 = "// TODO::after_date('2020-01-01'): fix me";
  const validLine2 = "// FIXME::after_date('2020-01-01'): fix me";

  const res1 = startsWithKeyword(validLine1, keywords);
  const res2 = startsWithKeyword(validLine2, keywords);

  expect(res1).toBe(true);
  expect(res2).toBe(true);
});

test("startsWithKeyword returns false on lines that don't start with keywords", () => {
  const keywords = ["TODO", "FIXME"];
  const invalidLine = "// NOTAVALIDKEYWORD::after_date('2020-01-01'): fix me";
  const res = startsWithKeyword(invalidLine, keywords);

  expect(res).toBe(false);
});

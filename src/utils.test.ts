import { isValidWarnOption, parseWarnOption , getWarningPeriod } from './utils'

test("isValidWarnOption validates", () => {
  const validWeeks = '1w'
  const validDays = '20d'
  const validHours = '24h'
  const resultW = isValidWarnOption(validWeeks)
  const resultD = isValidWarnOption(validDays)
  const resultH = isValidWarnOption(validHours)

  expect(resultW).toBe(validWeeks);
  expect(resultD).toBe(validDays);
  expect(resultH).toBe(validHours);
});

test("isValidWarnOption invalidates", () => {
  const invalid1 = 'rew'
  const invalid2 = ''
  const invalid3 = '20g'
  const result1 = isValidWarnOption(invalid1)
  const result2 = isValidWarnOption(invalid2)
  const result3 = isValidWarnOption(invalid3)

  expect(result1).toBe(false);
  expect(result2).toBe(false);
  expect(result3).toBe(false);
});

test("parseWarnOption", () => {
  const opt = '23h'
  const [multipler, interval] = parseWarnOption(opt)

  expect(multipler).toBe(23)
  expect(interval).toBe('h')
})

test("parseWarnOption with wrong option", () => {
  const opt = '5x'
  const [multipler, interval] = parseWarnOption(opt)

  expect(multipler).toBe(1)
  expect(interval).toBe('w')
})

test("getWarningPeriod with true", () => {
  const option = true
  const res = getWarningPeriod(option)

  expect(res).toBe(604800)
})

test("getWarningPeriod with interval option", () => {
  const option = '1h'
  const res = getWarningPeriod(option)

  expect(res).toBe(3600)
})

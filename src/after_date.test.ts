import { after_date } from "./after_date";

const mockOptions = {
  after_date: {
    warn: "4d",
  },
};

test("after_date works", () => {
  const date = "1-08-2021";
  const res = after_date(date, mockOptions);

  expect(res.error).toBe(true);
});

test("after_date works without options", () => {
  const date = "1-08-2021";
  const res = after_date(date);

  expect(res.error).toBe(true);
});

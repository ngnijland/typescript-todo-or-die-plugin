import { when } from "./when";

const mockOptions = {
  when: {
    warn: "2p",
  },
};

const mockPackageJson = {
  dependencies: {
    typescript: "^4.4.3",
  },
};

test("when works", () => {
  const param = '"typescript", ">4.0.0"';

  const res = when(param, {
    pjson: mockPackageJson,
    options: mockOptions.when,
  });

  expect(res.error).toBe(true)
});

test("when does not error", () => {
  const param = '"typescript", ">5.0.0"';

  const res = when(param, {
    pjson: mockPackageJson,
    options: mockOptions.when,
  });

  expect(res.error).toBe(false)
});

test("when does warn", () => {
  const param = '"typescript", ">4.4.5"';

  const res = when(param, {
    pjson: mockPackageJson,
    options: mockOptions.when,
  });

  expect(res.error).toBe(true)
});

test("when works without options", () => {
  const param = '"typescript", ">4.4.1"';

  const res = when(param, {
    pjson: mockPackageJson,
    options: undefined
  });

  expect(res.error).toBe(true)
});

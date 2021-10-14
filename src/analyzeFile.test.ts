import { DiagnosticCategory } from "typescript";

import { analyzeFile } from "./analyzeFile";
import { DiagnosticError } from "./types";

jest.mock("./utils", () => {
  const originalModule = jest.requireActual("./utils");

  return {
    __esModule: true,
    ...originalModule,
    getGitBranch: () => "main",
  };
});

test("analyzeFile handles after_date comments correctly", () => {
  const file = `
    // TODO::after_date("2021-01-01"): fix me!\n
    // TODO::after_date("2999-01-01"): fix me!
  `;
  const keywords = ["TODO"];
  const packageJson = {};

  const expected = [
    {
      category: DiagnosticCategory.Error,
      condition: `after_date("2021-01-01")`,
      error: true,
      line: '    // TODO::after_date("2021-01-01"): fix me!',
      lineNumber: 1,
      message: "It's time to do it!",
    },
  ];

  expect(analyzeFile(file, { keywords, packageJson })).toEqual(expected);
});

test("analyzeFile handles when comments correctly", () => {
  const file = `
    // TODO::when("foo", ">0.1.0"): fix me!\n
    // TODO::when("foo", ">2.0.0"): fix me!
  `;
  const keywords = ["TODO"];
  const options = {
    when: {
      warn: "1p",
    },
  };
  const packageJson = {
    dependencies: {
      foo: "^1.0.0",
    },
  };

  const expected = [
    {
      category: DiagnosticCategory.Error,
      condition: `when("foo", ">0.1.0")`,
      error: true,
      line: '    // TODO::when("foo", ">0.1.0"): fix me!',
      lineNumber: 1,
      message: "Your package has arrived! Now on 1.0.0",
    },
  ];

  expect(analyzeFile(file, { keywords, options, packageJson })).toEqual(
    expected
  );
  expect(analyzeFile(file, { keywords, packageJson })).toEqual(expected);
});

test("analyzeFile handles on_branch comments correctly", () => {
  const file = `
    // TODO::on_branch("main"): fix me!\n
    // TODO::on_branch("feat/story"): fix me!
  `;
  const keywords = ["TODO"];
  const options = {};
  const packageJson = {};

  const expected = [
    {
      category: DiagnosticCategory.Error,
      condition: `on_branch("main")`,
      error: true,
      line: '    // TODO::on_branch("main"): fix me!',
      lineNumber: 1,
      message: "It's time to do it!",
    },
  ];

  expect(analyzeFile(file, { keywords, options, packageJson })).toEqual(
    expected
  );
});

test("analyzeFile ignores comments with unknown conditions", () => {
  const file = `
    // TODO::non_existent("foo"): fix me!\n
  `;
  const keywords = ["TODO"];
  const packageJson = {};

  const expected = [] as DiagnosticError[];

  expect(analyzeFile(file, { keywords, packageJson })).toEqual(expected);
});

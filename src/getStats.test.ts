import { DiagnosticCategory } from "typescript";

import { getStats } from "./getStats";

test("getStats returns stats correctly", () => {
  expect(getStats([])).toEqual({ errors: 0, warnings: 0 });
  expect(
    getStats([
      {
        category: DiagnosticCategory.Error,
        error: true,
        message: "Foo",
        condition: "Baz",
        line: "Bar",
        lineNumber: 0,
      },
      {
        category: DiagnosticCategory.Warning,
        error: true,
        message: "Foo",
        condition: "Baz",
        line: "Bar",
        lineNumber: 0,
      },
    ])
  ).toEqual({ errors: 1, warnings: 1 });
});

import { DiagnosticCategory } from "typescript";

import { DiagnosticError } from "./types";

export type Stats = {
  errors: number;
  warnings: number;
};

export function getStats(diagnostics: DiagnosticError[]): Stats {
  return diagnostics.reduce(
    (acc, { category }) => {
      if (category === DiagnosticCategory.Error) {
        return {
          ...acc,
          errors: acc.errors + 1,
        };
      }

      if (category === DiagnosticCategory.Warning) {
        return {
          ...acc,
          warnings: acc.warnings + 1,
        };
      }

      return acc;
    },
    { errors: 0, warnings: 0 }
  );
}

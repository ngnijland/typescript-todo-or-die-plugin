import chalk from "chalk";
import Table from "easy-table";
import { DiagnosticCategory } from "typescript";

import { DiagnosticError } from "./types";

function getCategory(category: DiagnosticCategory) {
  switch (category) {
    case DiagnosticCategory.Warning: {
      return chalk.yellow("warning");
    }
    case DiagnosticCategory.Error: {
      return chalk.red("error");
    }
    default: {
      return chalk.grey("unknown");
    }
  }
}

export function printDiagnostics(
  diagnostics: DiagnosticError[],
  file: string
): void {
  console.log(`${chalk.underline(file)}`);

  const t = new Table();

  diagnostics.forEach(({ category, condition, lineNumber, message }) => {
    t.cell("Line number", `  ${chalk.grey(lineNumber)}`);
    t.cell("Category", getCategory(category));
    t.cell("Message", message);
    t.cell("Condition", chalk.grey(condition));
    t.newRow();
  });

  console.log(t.print());
}

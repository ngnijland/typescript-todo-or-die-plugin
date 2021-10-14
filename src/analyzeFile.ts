import {
  Conditions,
  Diagnostic,
  DiagnosticError,
  ValidateContext,
} from "./types";
import { startsWithKeyword } from "./utils";
import { after_date } from "./after_date";
import { on_branch } from "./on_branch";
import { when } from "./when";

type Line = [string, number];

const conditions: Conditions = {
  after_date,
  on_branch,
  when,
};

function isDiagnosticError(
  validation: Diagnostic
): validation is DiagnosticError {
  return validation.error === true;
}

export function analyzeFile(
  file: string,
  { keywords, options, packageJson }: ValidateContext
): DiagnosticError[] {
  const lines = file.split("\n").reduce<Line[]>((acc, line, index) => {
    if (startsWithKeyword(line.trim(), keywords)) {
      return [...acc, [line, index]];
    }

    return acc;
  }, []);

  return lines.reduce<DiagnosticError[]>((acc, [line, lineNumber]) => {
    const condition = line.substring(
      line.indexOf("::") + 2,
      line.lastIndexOf(":")
    );
    const param = line.substring(line.indexOf("(") + 1, line.lastIndexOf(")"));

    if (condition.startsWith("after_date")) {
      const validation = conditions.after_date(param, options);

      if (!validation.error) {
        return acc;
      }

      return [
        ...acc,
        {
          ...validation,
          condition,
          line,
          lineNumber,
        },
      ];
    }

    if (condition.startsWith("when")) {
      const validation = conditions.when(param, {
        pjson: packageJson,
        options: options?.when,
      });

      if (!validation.error) {
        return acc;
      }

      return [
        ...acc,
        {
          ...validation,
          condition,
          line,
          lineNumber,
        },
      ];
    }

    if (condition.startsWith("on_branch")) {
      const validation = conditions.on_branch(param);

      if (!validation.error) {
        return acc;
      }

      return [
        ...acc,
        {
          ...validation,
          condition,
          line,
          lineNumber,
        },
      ];
    }

    return acc;
  }, []);
}

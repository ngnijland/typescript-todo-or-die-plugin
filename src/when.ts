import { DiagnosticCategory } from "typescript";
import {
  ConfigOptions,
  Validation,
  WhenConfig,
  ValidationApproval,
} from "./types";
import { getWarningWhen, getSplitPackageVersion, pipe } from "./utils";

const noerror: ValidationApproval = {
  error: false,
};

const clean = (version: string): string => {
  const first = version.charAt(0);

  if (["~", "^", "=", ">"].includes(first)) {
    return version.substring(1);
  }

  return version;
};

type State = {
  skip: boolean;
  validation: Validation;
};

type ValidationState = {
  currentNumbers: number[];
  matchNumbers: number[];
  state: State["validation"];
};

const compareForWarning = (
  curr: number,
  match: number,
  versionAhead: number
): boolean => {
  return match - curr <= versionAhead;
};

const checkEquality = (
  currentNumbers: number[],
  matchNumbers: number[]
): ValidationState => {
  if (currentNumbers.join("") === matchNumbers.join("")) {
    return {
      currentNumbers,
      matchNumbers,
      state: {
        error: true,
        message: `It's a match, fix it'! Now on ${currentNumbers.join(".")}`,
        category: DiagnosticCategory.Error,
      },
    };
  }

  return {
    currentNumbers,
    matchNumbers,
    state: noerror,
  };
};

const checkForErrors = (
  currentNumbers: number[],
  matchNumbers: number[]
): ValidationState => {
  const state = currentNumbers.reduce(
    (acc: State, next: number, idx: number): State => {
      if (acc.skip) {
        return acc;
      }

      const isIssue = next > matchNumbers[idx] || 0;

      if (isIssue) {
        return {
          skip: true,
          validation: {
            error: true,
            message: `Your package has arrived! Now on ${currentNumbers.join(
              "."
            )}`,
            category: DiagnosticCategory.Error,
          },
        };
      }

      return next < matchNumbers[idx] || 0
        ? {
            skip: true,
            validation: noerror,
          }
        : acc;
    },
    {
      skip: false,
      validation: noerror,
    }
  );

  return {
    currentNumbers,
    matchNumbers,
    state: state.validation,
  };
};

const checkForWarnings =
  (warningOption: string | boolean | undefined) =>
  ({ currentNumbers, matchNumbers, state }: ValidationState): Validation => {
    if (state.error) {
      return state;
    }

    if (warningOption) {
      const [versionAhead, level] = getWarningWhen(warningOption);

      const { validation } = currentNumbers.reduce(
        (acc: State, next: number, idx: number): State => {
          if (acc.skip) {
            return acc;
          }

          const shouldWarn =
            parseInt(currentNumbers.join(""), 10) <
            parseInt(matchNumbers.join(""));

          const isWarning =
            shouldWarn &&
            idx === level &&
            compareForWarning(next, matchNumbers[idx] || 0, versionAhead);

          if (isWarning) {
            return {
              skip: true,
              validation: {
                error: true,
                message: `Get ready, your package is on the way!`,
                category: DiagnosticCategory.Warning,
              },
            };
          }

          return next < matchNumbers[idx] || 0
            ? {
                skip: true,
                validation: noerror,
              }
            : acc;
        },
        { skip: false, validation: noerror }
      );

      return validation;
    }

    return noerror;
  };

const getWhenIssue = (
  current: string,
  match: string,
  options: ConfigOptions["when"]
): Validation => {
  const comparator = match.charAt(0);
  const warningOption = options?.warn;
  const currentNumbers = getSplitPackageVersion(clean(current));
  const matchNumbers = getSplitPackageVersion(clean(match));

  if (comparator === "=") {
    const validation = pipe(checkEquality, checkForWarnings(warningOption))(
      currentNumbers,
      matchNumbers
    );

    return validation;
  }

  if (comparator === ">") {
    const validation = pipe(checkForErrors, checkForWarnings(warningOption))(
      currentNumbers,
      matchNumbers
    );

    return validation;
  }

  return noerror;
};

export const when = (
  conditionParam: string,
  config: WhenConfig
): Validation => {
  if (!config || !conditionParam) {
    return noerror;
  }

  const [dependency, matchVersion] = conditionParam
    .split(",")
    .map((s) => s.replace(/"|'/g, "").trim());

  const packages = {
    ...config.pjson?.devDependecies,
    ...config.pjson?.dependencies,
  };

  if (!packages[dependency]) {
    return noerror;
  }

  return getWhenIssue(packages[dependency], matchVersion, config.options);
};

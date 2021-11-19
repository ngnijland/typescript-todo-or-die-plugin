import { DiagnosticCategory } from "typescript";

export type Conditions = {
  after_date: (param: string, options?: ConfigOptions) => Validation;
  when: (param: string, config: WhenConfig) => Validation;
  on_branch: (param: string) => Validation;
};

export type ValidationError = {
  category: DiagnosticCategory;
  error: true;
  message: string;
};

export type ValidationApproval = {
  error: false;
};

export type DiagnosticError = ValidationError & {
  condition: string;
  line: string;
  lineNumber: number;
};

export type DiagnosticApproval = {
  error: false;
};

export type ConfigOptions = {
  after_date?: {
    warn?: string | boolean;
  };
  when?: {
    warn?: string | boolean;
  };
};

export type WhenConfig = {
  pjson?: Record<string, any> | null;
  options?: ConfigOptions["when"];
};

export type ValidateContext = {
  options?: ConfigOptions;
  packageJson: Record<string, unknown> | null;
  keywords: string[];
};

export type Diagnostic = DiagnosticError | DiagnosticApproval;

export type Validation = ValidationError | ValidationApproval;

export type Periods = { w: number; d: number; h: number };

export type ValidateTodo = {
  additionalKeywords?: string[];
  options?: ConfigOptions;
  todo: string;
};

export type Levels = {
  M: number;
  m: number;
  p: number;
};

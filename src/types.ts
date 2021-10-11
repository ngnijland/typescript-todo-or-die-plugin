import { DiagnosticCategory } from "typescript";
export type Conditions = {
  after_date: (param: string, options?: ConfigOptions) => Validation;
  when: (param: string, config: WhenConfig) => Validation;
};

export type DiagnosticError = {
  error: true;
  message: string;
  category: DiagnosticCategory;
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

export type ValidateMetaData = {
  options: ConfigOptions;
  packageJson: Record<string, unknown> | null;
};

export type Validation = DiagnosticError | DiagnosticApproval;

export type Periods = { w: number; d: number; h: number };

export type Levels = {
  M: number;
  m: number;
  p: number;
};

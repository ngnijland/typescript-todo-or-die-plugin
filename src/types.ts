import { DiagnosticCategory } from "typescript";
export type Conditions = {
  after_date: (param: string, options?: ConfigOptions) => Validation;
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
};

export type Validation = DiagnosticError | DiagnosticApproval;

export type Periods = { w: number; d: number; h: number };

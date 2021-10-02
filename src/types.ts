export type Conditions = {
  after_date: (param: string, options?: ConfigOptions) => Validation;
};

export type DiagnosticError = {
  error: true;
  message: string;
  category: "warning" | "error";
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

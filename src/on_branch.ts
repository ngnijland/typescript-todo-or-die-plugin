import { DiagnosticCategory } from "typescript";
import { Validation } from "./types";
import { getGitBranch } from "./utils";


const getOnBranchIssue = (
  branchName: string,
): Validation => {
  const currentGitBranch = getGitBranch();

  if (branchName === currentGitBranch) {
    return {
      error: true,
      message: "It's time to do it!",
      category: DiagnosticCategory.Error,
    };
  }

  return {
    error: false,
  };
};

export function on_branch(branchName: string): Validation {
  return getOnBranchIssue(branchName.replace(/"|'/g, "").trim());
}

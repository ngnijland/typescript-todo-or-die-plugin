import { on_branch } from "./on_branch";

jest.mock('./utils', () => ({
	__esModule: true,
	getGitBranch: () => 'master',
}))

test("on_branch is triggered on matching branch", () => {
  const branch = "master";
  const res = on_branch(branch);

  expect(res.error).toBe(true);
});

test("on_branch is not triggered on not matching branch", () => {
  const branch = "feature/branch";
  const res = on_branch(branch);

  expect(res.error).toBe(false);
});

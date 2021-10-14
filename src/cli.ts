#!/usr/bin/env node

import { program } from "commander";
import fs from "fs";
import chalk from "chalk";

import { getFilesFromInput } from "./getFilesFromInput";
import { analyzeFile } from "./analyzeFile";
import { printDiagnostics } from "./printDiagnostics";
import { Stats, getStats } from "./getStats";

type PackageJSON = {
  version: `${number}.${number}.${number}`;
};

type Plugin = {
  name: string;
  [key: string]: unknown;
};

const { version }: PackageJSON = require("../package.json");

program
  .description("An application to lint your TODO comments")
  .version(version)
  .argument("<file|dir|glob...>", "Files to check for comments")
  .action(async (input) => {
    const [error, files] = await getFilesFromInput(input);

    if (error) {
      console.error(error.message);
      process.exit(1);
    }

    if (!files) {
      console.error("No files found.");
      process.exit(1);
    }

    const stats: Stats = {
      errors: 0,
      warnings: 0,
    };

    const currentDirectory = process.cwd();

    // Read project package.json
    const packageJsonPath = `${currentDirectory}/package.json`;

    if (!fs.existsSync(packageJsonPath)) {
      console.error(
        `"package.json" not found. Make sure to run this command from the root folder of your project.`
      );
      process.exit(1);
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

    // Read project tsconfig.json
    const tsconfigJsonPath = `${currentDirectory}/tsconfig.json`;

    if (!fs.existsSync(tsconfigJsonPath)) {
      console.error(
        `"tsconfig.json" not found. Make sure to run this command from the root folder of a TypeScript project.`
      );
      process.exit(1);
    }

    const tsconfigJson = JSON.parse(fs.readFileSync(tsconfigJsonPath, "utf8"));
    const config = tsconfigJson?.compilerOptions?.plugins?.find(
      (plugin: Plugin) => plugin.name === "typescript-todo-or-die-plugin"
    );

    const options = config?.options;
    const additionalKeywords = config?.additionalKeywords || [];

    files.forEach((file) => {
      const doc = fs.readFileSync(file, { encoding: "utf-8" });

      const diagnostics = analyzeFile(doc, {
        keywords: ["TODO", "FIXME", ...additionalKeywords],
        packageJson,
        options,
      });

      if (diagnostics.length === 0) {
        return;
      }

      const { errors, warnings } = getStats(diagnostics);

      stats.errors += errors;
      stats.warnings += warnings;

      printDiagnostics(diagnostics, file);
    });

    const statsText = `${stats.errors + stats.warnings} problems (${
      stats.errors
    } errors, ${stats.warnings} warnings)`;

    if (stats.errors > 0) {
      console.log(chalk.red.bold(statsText));
    } else if (stats.warnings > 0) {
      console.log(chalk.yellow.bold(statsText));
    } else {
      console.log(chalk.green.bold("No unfinished TODO's. Well done!"));
    }

    if (stats.errors > 0) {
      process.exit(1);
    }

    if (process.env.CI && stats.warnings > 0) {
      process.exit(1);
    }
  })
  .parse(process.argv);

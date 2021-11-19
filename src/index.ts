import * as path from "path";
import { getJsonFromFile } from "./utils";
import { analyzeFile } from "./analyzeFile";
import { ConfigOptions } from "./types";

type Config = {
  options?: ConfigOptions;
  additionalKeywords?: string[];
};

interface PluginCreateInfo extends ts.server.PluginCreateInfo {
  config: Config;
}

function init(modules: {
  typescript: typeof import("typescript/lib/tsserverlibrary");
}) {
  const ts = modules.typescript;

  function create({ config, languageService, project }: PluginCreateInfo) {
    // Diagnostic logging
    project.projectService.logger.info(
      "WELCOME TO TODO OR DIE, BE PREPARED TO SOLVE YOUR TODO COMMENTS!"
    );

    // Set up decorator object
    const proxy: ts.LanguageService = Object.create(null);
    for (let k of Object.keys(languageService) as Array<
      keyof ts.LanguageService
    >) {
      const x = languageService[k]!;
      // @ts-expect-error - JS runtime trickery which is tricky to type tersely
      proxy[k] = (...args: Array<{}>) => x.apply(languageService, args);
    }

    proxy.getSemanticDiagnostics = (filename) => {
      const prior = languageService.getSemanticDiagnostics(filename);
      const doc = languageService.getProgram()?.getSourceFile(filename);

      const rootDir = project.getCurrentDirectory();
      const packageJson = getJsonFromFile(
        `${path.normalize(rootDir)}/package.json`
      );

      if (!doc) {
        return prior;
      }

      const additionalKeywords =
        config?.additionalKeywords && Array.isArray(config.additionalKeywords)
          ? config.additionalKeywords.filter(
              (keyword) => typeof keyword === "string"
            )
          : [];

      const keywords = ["TODO", "FIXME", ...additionalKeywords];

      const context = {
        options: config?.options,
        packageJson,
        keywords,
      };

      const validations = analyzeFile(doc.text, context);

      return [
        ...prior,
        ...validations.map(({ category, line, lineNumber, message }) => ({
          file: doc,
          start: doc.getPositionOfLineAndCharacter(lineNumber, 0),
          length: line.length,
          messageText: message,
          category: category,
          source: "TOD",
          code: 666,
        })),
      ];
    };

    return proxy;
  }

  return { create };
}

export = init;

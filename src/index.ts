import { validateTodo } from "./validateTodo";

function init(modules: {
  typescript: typeof import("typescript/lib/tsserverlibrary");
}) {
  const ts = modules.typescript;

  function create(info: ts.server.PluginCreateInfo) {
    // Diagnostic logging
    info.project.projectService.logger.info(
      "WELCOME TO TODO OR DIE, BE PREPARED TO SOLVE YOUR TODO COMMENTS!"
    );

    // Set up decorator object
    const proxy: ts.LanguageService = Object.create(null);
    for (let k of Object.keys(info.languageService) as Array<
      keyof ts.LanguageService
    >) {
      const x = info.languageService[k]!;
      // @ts-expect-error - JS runtime trickery which is tricky to type tersely
      proxy[k] = (...args: Array<{}>) => x.apply(info.languageService, args);
    }

    proxy.getSemanticDiagnostics = (filename) => {
      const prior = info.languageService.getSemanticDiagnostics(filename);
      const doc = info.languageService.getProgram()?.getSourceFile(filename);

      if (!doc) {
        return prior;
      }

      const lines = doc.text
        .split("\n")
        .map((line, index): [number, number, string] => [
          index + 1,
          line.length + 1,
          line.trim(),
        ]);

      const { diagnostics } = lines.reduce(
        (
          acc: { diagnostics: ts.Diagnostic[]; characterCount: number },
          [, lineLength, text]
        ) => {
          const newLineLength = acc.characterCount + lineLength;

          if (!text.startsWith("// TODO::")) {
            return {
              diagnostics: acc.diagnostics,
              characterCount: newLineLength,
            };
          }

          const { error, message } = validateTodo(text);

          if (!error) {
            return {
              diagnostics: acc.diagnostics,
              characterCount: newLineLength,
            };
          }

          return {
            diagnostics: [
              ...acc.diagnostics,
              {
                file: doc,
                start: acc.characterCount,
                length: lineLength - 1,
                messageText: message || "",
                category: ts.DiagnosticCategory.Error,
                source: "tod",
                code: 9999,
              },
            ],
            characterCount: newLineLength,
          };
        },
        { diagnostics: [], characterCount: 0 }
      );

      return [...prior, ...diagnostics];
    };

    return proxy;
  }

  return { create };
}

export = init;

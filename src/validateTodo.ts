import { Validation, ValidateTodo, Conditions } from "./types";
import { after_date } from "./after_date";
import { startsWithKeyword } from "./utils";

const conditions: Conditions = {
  after_date,
};

export function validateTodo({
  additionalKeywords,
  options,
  todo,
}: ValidateTodo): Validation {
  const keywords = [
    "TODO",
    "FIXME",
    ...(additionalKeywords ? additionalKeywords : []),
  ];

  if (startsWithKeyword(todo, keywords)) {
    const condition = todo.substring(
      todo.indexOf("::") + 2,
      todo.lastIndexOf(":")
    );

    if (condition.startsWith("after_date")) {
      const param = todo.substring(
        todo.indexOf("(") + 2,
        todo.lastIndexOf(")")
      );

      return conditions.after_date(param, options);
    }
  }

  return { error: false };
}

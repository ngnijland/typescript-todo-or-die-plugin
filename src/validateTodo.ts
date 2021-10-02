import { Validation, ConfigOptions, Conditions } from './types'
import { after_date } from './after_date';

const conditions: Conditions = {
  after_date,
};

export function validateTodo(
  todo: string,
  options?: ConfigOptions
): Validation {
  if (!todo.startsWith("// TODO::")) {
    return {
      error: false,
    };
  }

  const condition = todo.substring(
    todo.indexOf("::") + 2,
    todo.lastIndexOf(":")
  );

  if (condition.startsWith("after_date")) {
    const param = todo.substring(todo.indexOf("(") + 2, todo.lastIndexOf(")"));

    return conditions.after_date(param, options);
  }

  return { error: false };
}

type DiagnosticError = {
  error: boolean;
  message?: string;
};

function after_date(date: string): DiagnosticError {
  const now = new Date();
  const dateParam = new Date(date);

  if (now > dateParam) {
    return {
      error: true,
      message: "It time to do it!",
    };
  }

  return {
    error: false,
  };
}

const conditions = {
  after_date,
};

export function validateTodo(todo: string): DiagnosticError {
  const condition = todo.substring(
    todo.indexOf("::") + 2,
    todo.lastIndexOf(":")
  );

  if (condition.startsWith("after_date")) {
    const param = todo.substring(todo.indexOf("(") + 2, todo.lastIndexOf(")"));

    return conditions.after_date(param);
  }

  return { error: false };
}

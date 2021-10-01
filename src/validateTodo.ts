type DiagnosticError = {
  error: true;
  message: string;
};

type DiagnosticApproval = {
  error: false;
};

type Validation = DiagnosticError | DiagnosticApproval;

function after_date(date: string): Validation {
  const now = new Date();
  const dateParam = new Date(date);

  if (now > dateParam) {
    return {
      error: true,
      message: "It's time to do it!",
    };
  }

  return {
    error: false,
  };
}

const conditions = {
  after_date,
};

export function validateTodo(todo: string): Validation {
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

    return conditions.after_date(param);
  }

  return { error: false };
}

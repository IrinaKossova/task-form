const isInteger = (value) => {
  return Number.isInteger(Number(value));
};

const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

export const validateForm = (formState, apiToken) => {
  const errors = {};

  if (!apiToken) {
    errors.apiToken = "Необходимо указать API Token.";
  }

  // Заголовок
  if (!formState.title) {
    errors.title = "Необходимо указать заголовок.";
  } else if (formState.title.length < 1) {
    errors.title = "Заголовок должен содержать минимум 1 символ.";
  } else if (formState.title.length > 255) {
    errors.title = "Заголовок не может содержать более 255 символов.";
  }

  // Описание
  if (!formState.description) {
    errors.description = "Необходимо указать описание.";
  } else if (formState.description.length < 10) {
    errors.description = "Описание должно содержать минимум 10 символов.";
  } else if (formState.description.length > 10000) {
    errors.description = "Описание не может содержать более 10000 символов.";
  }

  // Теги 
  if (formState.tags) {
    const tagsArray = formState.tags.split(",");
    if (tagsArray.length > 10) {
      errors.tags = "Максимальное количество тегов - 10.";
    } else {
      for (let i = 0; i < tagsArray.length; i++) {
        const tag = tagsArray[i].trim();
        if (tag.length > 50) {
          errors.tags = `Длина тега "${tag}" не может превышать 50 символов.`;
          break;
        }
      }
    }
  }

  // Функция для проверки числового поля
  const validateNumberField = (fieldName, fieldValue, isRequired, minValue, maxValue, errorMessageRequired, errorMessageType, errorMessageMin, errorMessageMax) => {
    let error = null;

    if (isRequired && !fieldValue) {
      error = errorMessageRequired;
    } else if (fieldValue && !isInteger(fieldValue)) {
      error = errorMessageType;
    } else if (fieldValue !== undefined) {
      const numValue = Number(fieldValue);
      if (minValue !== undefined && numValue < minValue) {
        error = errorMessageMin;
      } else if (maxValue !== undefined && numValue > maxValue) {
        error = errorMessageMax;
      }
    }
    return error;
  };

  // Минимальный бюджет 
  let budgetFromError = validateNumberField(
    "budget_from",
    formState.budget_from,
    true,
    0,
    undefined,
    "Необходимо указать минимальный бюджет.",
    "минимальный бюджет должен быть целым числом.",
    "минимальный бюджет не может быть меньше 0.",
    undefined
  );

  if (budgetFromError) {
    errors.budget_from = budgetFromError;
  }

  // Максимальный бюджет
  let budgetToError = validateNumberField(
    "budget_to",
    formState.budget_to,
    true,
    formState.budget_from ? Number(formState.budget_from) + 1 : 1,
    1000000,
    "Необходимо указать максимальный бюджет.",
    "Максимальный бюджет должен быть целым числом.",
    "Максимальный бюджет не может быть меньше, чем минимальный бюджет.",
    "Максимальный бюджет до не может быть больше 1 000 000."
  );

  if (budgetToError) {
    errors.budget_to = budgetToError;
  }

  // Дней на выполнение
  let deadlineDaysError = validateNumberField(
    "deadline_days",
    formState.deadline_days,
    true,
    1,
    365,
    "Необходимо указать количество дней на выполнение.",
    "Укажите количество дней в формате целого числа.",
    "Минимальный срок выполнения составляет 1 день.",
    "Максимальный срок выполнения составляет 365 дней."
  );

  if (deadlineDaysError) {
    errors.deadline_days = deadlineDaysError;
  }

  // Количество напоминаний
  let numberOfRemindersError = validateNumberField(
    "number_of_reminders",
    formState.number_of_reminders,
    true,
    0,
    10,
    "Необходимо указать количество напоминаний.",
    "Укажите количество напоминаний в формате целого числа.",
    "Количество напоминаний не может быть меньше 1.",
    "Количество напоминаний не может быть больше 10."
  );

  if (numberOfRemindersError) {
    errors.number_of_reminders = numberOfRemindersError;
  }

  // Контент, доступный по ссылке
  if (formState.private_content) {
    if (!isValidURL(formState.private_content)) {
      errors.private_content = "Неверный формат ссылки.";
    } else if (formState.private_content.length > 2048) {
      errors.private_content = "Ссылка не может быть длиннее 2048 символов.";
    }
  }

  // Функция для проверки полей правил
  const validateRulesField = (fieldName, fieldValue, minValue, maxValue, isRequired) => {
    const errors = {};

    if (isRequired && !fieldValue) {
      errors[fieldName] = `Необходимо указать ${fieldName}`;
    } else if (fieldValue && !isInteger(fieldValue)) {
      errors[fieldName] = `Поле ${fieldName} должно быть целым числом.`;
    } else if (fieldValue !== undefined) {
      const numValue = Number(fieldValue);
      if (minValue !== undefined && numValue < minValue) {
        errors[fieldName] = `Поле ${fieldName} не может быть меньше ${minValue}.`;
      } else if (maxValue !== undefined && numValue > maxValue) {
        errors[fieldName] = `Поле ${fieldName} не может быть больше ${maxValue}.`;
      }
    }
    return errors;
  };

  // Правила
  const rulesErrors = {};

  // Минимальный бюджет 
  const rulesBudgetFromErrors = validateRulesField("budget_from", formState.rules.budget_from, 0, undefined, false); 
  if (Object.keys(rulesBudgetFromErrors).length > 0) {
    Object.assign(rulesErrors, rulesBudgetFromErrors);
  }

  // Максимальный бюджет
  const rulesBudgetToErrors = validateRulesField(
    "budget_to",
    formState.rules.budget_to,
    formState.rules.budget_from ? Number(formState.rules.budget_from) + 1 : 1,
    1000000,
    false 
  );
  if (Object.keys(rulesBudgetToErrors).length > 0) {
    Object.assign(rulesErrors, rulesBudgetToErrors);
  }

  // Дней на выполнение 
  const rulesDeadlineDaysErrors = validateRulesField("deadline_days", formState.rules.deadline_days, 1, 365, false); 
  if (Object.keys(rulesDeadlineDaysErrors).length > 0) {
    Object.assign(rulesErrors, rulesDeadlineDaysErrors);
  }

  // Количество исполнителей 
  const rulesQtyFreelancersErrors = validateRulesField("qty_freelancers", formState.rules.qty_freelancers, 1, 1000, false); 
  if (Object.keys(rulesQtyFreelancersErrors).length > 0) {
    Object.assign(rulesErrors, rulesQtyFreelancersErrors);
  }

  // ID задачи 
  if (!formState.rules.task_id) {
    rulesErrors.task_id = "Необходимо указать Task ID";
  } else if (!isInteger(formState.rules.task_id)) {
    rulesErrors.task_id = "Task ID должно быть целым числом.";
  } else if (Number(formState.rules.task_id) <= 0) {
    rulesErrors.task_id = "Task ID должно быть положительным числом.";
  }

  // Добавить ошибки в правилах в общий объект ошибок
  if (Object.keys(rulesErrors).length > 0) {
    errors.rules = rulesErrors;
  }

  return errors;
};
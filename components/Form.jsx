import React, { useState, useEffect, useCallback } from "react"; 
import axios from "axios";
import InputField from "./InputField";
import RulesFields from "./RulesFields";
import { validateForm } from "../utils/validation";

const initialFormState = {
  id: undefined,
  title: "",
  description: "",
  tags: "",
  budget_from: undefined,
  budget_to: undefined,
  deadline_days: undefined,
  number_of_reminders: undefined,
  private_content: "",
  apiToken: "",
  rules: {
    budget_from: undefined,
    budget_to: undefined,
    deadline_days: undefined,
    qty_freelancers: undefined,
    task_id: undefined,
  },
};

const Form = () => {
  const [formState, setFormState] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
     const apiTokenKey = "apiToken";
    const storedToken = localStorage.getItem(apiTokenKey);
    if (storedToken) {
      setFormState(prevState => ({ ...prevState, apiToken: storedToken }));
    }
  }, []);

  const handleInputChange = useCallback((e) => {
    const { id, value } = e.target;
    setFormState(prevState => ({ ...prevState, [id]: value }));
  }, []);

  const handleRulesChange = useCallback((field, value) => {
    setFormState(prevState => ({
      ...prevState,
      rules: { ...prevState.rules, [field]: value },
    }));
  }, []); 

  const handleSubmit = useCallback(async (e) => { 
    e.preventDefault();

    // Валидация формы
    const validationErrors = validateForm(formState, formState.apiToken);
    setErrors(validationErrors);

    // 13. Alert для случаев с ошибками валидации
    if (Object.keys(validationErrors).length > 0) {
        alert("Пожалуйста, заполните все обязательные поля и убедитесь, что данные введены правильно.");
      return;
    }

    try {
      // 16. Объект с данными задачи
      const taskData = {
        title: formState.title,
        description: formState.description,
        tags: formState.tags,
        budget_from: formState.budget_from,
        budget_to: formState.budget_to,
        deadline_days: formState.deadline_days,
        number_of_reminders: formState.number_of_reminders,
        private_content: formState.private_content,
        is_hard: true,
        all_auto_responses: false,
        rules: formState.rules,
      };

      // 17. Отправка запроса на сервер
      const response = await axios.post(
        "http://localhost:3001/task",
        taskData, 
        {
          headers: {
            Authorization: `Bearer ${formState.apiToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      // 18. Обработка ответа от сервера
      if (response.status === 201) {
        alert("Задача опубликована!"); 
        setFormState(initialFormState);
        setErrors({});
      } else {
        alert("Ошибка публикации задачи.");
      }
    } catch (error) {
      console.error("Ошибка:", error);
      alert(`Ошибка публикации задачи: ${error.message}`);
    }
  }, [formState, validateForm]); 

  return (
    <div className="container mx-auto py-6 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold mb-4 text-official-blue text-center">Создать задачу</h2>
      <p className="text-sm text-gray-600 mb-4">
        <span className="text-red-500">*</span> – Поле обязательно для заполнения.
      </p>

      <div className="flex">
        <div className="w-1/2 px-4">
          {/* Левая колонка */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <InputField
              label="API Token"
              id="apiToken"
              type="text"
              value={formState.apiToken}
              onChange={handleInputChange}
              required={true}
              error={errors.apiToken}
            />

            <InputField
              label="Заголовок"
              id="title"
              type="text"
              value={formState.title}
              onChange={handleInputChange}
              required={true}
              error={errors.title}
            />

            <InputField
              label="Описание"
              id="description"
              type="textarea"
              value={formState.description}
              onChange={handleInputChange}
              required={true}
              error={errors.description}
            />

            <InputField
              label="Теги (через запятую)"
              id="tags"
              type="text"
              value={formState.tags}
              onChange={handleInputChange}
              error={errors.tags}
            />

            <InputField
              label="Минимальный бюджет"
              id="budget_from"
              type="number"
              value={formState.budget_from}
              onChange={handleInputChange}
              required={true}
              error={errors.budget_from}
            />

            <InputField
              label="Максимальный бюджет"
              id="budget_to"
              type="number"
              value={formState.budget_to}
              onChange={handleInputChange}
              required={true}
              error={errors.budget_to}
            />

            <InputField
              label="Дней на выполнение"
              id="deadline_days"
              type="number"
              value={formState.deadline_days}
              onChange={handleInputChange}
              required={true}
              error={errors.deadline_days}
            />

            <InputField
              label="Количество напоминаний"
              id="number_of_reminders"
              type="number"
              value={formState.number_of_reminders}
              onChange={handleInputChange}
              required={true}
              error={errors.number_of_reminders}
            />

            <InputField
              label="Контент, доступный по ссылке"
              id="private_content"
              type="text"
              value={formState.private_content}
              onChange={handleInputChange}
              placeholder="https://example.com"
              error={errors.private_content}
            />

            <div>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-official-blue hover:bg-official-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-official-blue-500"
              >
                Опубликовать задачу
              </button>
            </div>
          </form>
        </div>
        <div className="w-1/2 px-4">
          {/* Правая колонка */}
          <RulesFields
            rules={formState.rules}
            onChange={handleRulesChange}
            errors={errors}
          />
        </div>
      </div>
    </div>
  );
};

export default Form;
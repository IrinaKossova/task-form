import React, { useCallback } from "react"; 
import InputField from "./InputField"; 

const RulesFields = ({ rules, onChange, errors }) => {

  const handleChange = useCallback((field, value) => {
    onChange(field, value);
  }, [onChange]); 

  return (
    <div>
       <h2 className="text-2xl font-bold mb-4 text-official-blue text-center">Правила</h2> 

      <InputField
        label="Минимальный бюджет"
        id="budget_from"
        type="number"
        value={rules.budget_from}
        onChange={(e) => handleChange("budget_from", e.target.value)} 
        error={errors?.rules?.budget_from} 
      />

      <InputField
        label="Максимальный бюджет"
        id="budget_to"
        type="number"
        value={rules.budget_to}
        onChange={(e) => handleChange("budget_to", e.target.value)} 
        error={errors?.rules?.budget_to} 
      />

      <InputField
        label="Дней на выполнение"
        id="deadline_days"
        type="number"
        value={rules.deadline_days}
        onChange={(e) => handleChange("deadline_days", e.target.value)} 
        error={errors?.rules?.deadline_days} 
      />

      <InputField
        label="Количество исполнителей"
        id="qty_freelancers"
        type="number"
        value={rules.qty_freelancers}
        onChange={(e) => handleChange("qty_freelancers", e.target.value)} 
        error={errors?.rules?.qty_freelancers} 
      />

      <InputField
        label="ID задачи"
        id="task_id"
        type="number"
        value={rules.task_id}
        onChange={(e) => handleChange("task_id", e.target.value)} 
        error={errors?.rules?.task_id} 
      />
    </div>
  );
};

export default RulesFields;
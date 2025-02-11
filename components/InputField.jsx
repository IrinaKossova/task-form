import React from "react";

const InputField = ({ label, id, type, value, onChange, error, required, placeholder }) => {
  const inputClass =
    "shadow appearance-none border rounded w-full py-2 px-2 text-black leading-tight focus:outline-none focus:shadow-outline";

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-1">
        {type === "textarea" ? (
          <textarea
            id={id}
            rows={3}
            className={`${inputClass} resize-none`}
            onChange={onChange}
            placeholder={placeholder}
          />
        ) : (
          <input
            type={type}
            id={id}
            className={`${inputClass}`}
            value={value || ""}
            onChange={onChange}
            placeholder={placeholder}
          />
        )}
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default InputField;
import React from "react";

type Props = {
  value?: string | number | readonly string[];
  type?: React.HTMLInputTypeAttribute;
  id?: string;
  label?: string;
  placeholder?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  hasError?: boolean;
  errorMessage?: string;
  className?: string;
};

const FormInput = ({
  value,
  type,
  id,
  label,
  placeholder,
  onChange,
  onBlur,
  hasError,
  errorMessage,
  className = "border focus-ring rounded-xl focus-within:border-primary focus-within:ring focus-within:ring-primary focus-within:ring-opacity-50 text-sm block w-full p-2.5",
}: Props) => {
  return (
    <div className="mb-6">
      <label htmlFor={id} className="block mb-2 text-sm font-medium">
        {label}
      </label>
      <input
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        type={type}
        id={id}
        className={`${className} ${
          hasError &&
          "bg-red-50 border border-red-500 text-red-900 focus-ring-error placeholder-red-700"
        }`}
      />
      {hasError && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-500">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default FormInput;

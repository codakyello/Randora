function Input({
  name,
  id,
  type,
  placeholder,
  required,
  defaultValue,
  handleBlur,
  disabled,
  checked,
  onChange,
  value,
  className,
}: {
  name: string;
  type: string;
  id: string;
  placeholder?: string;
  required?: boolean;
  defaultChecked?: boolean;
  defaultValue?: string | number;
  disabled?: boolean;
  checked?: boolean;
  value?: string | number;
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}) {
  return (
    <input
      className={`py-[1rem]  md:text-[16px] px-[1.2rem] bg-[var(--color-grey-0)] border border-[var(--color-grey-300)] rounded-[var(--border-radius-sm)] ${className}`}
      name={name}
      type={type}
      id={id}
      value={value}
      required={required}
      placeholder={placeholder}
      defaultValue={defaultValue}
      onBlur={handleBlur}
      disabled={disabled}
      checked={checked}
      onChange={onChange}
    />
  );
}

export default Input;

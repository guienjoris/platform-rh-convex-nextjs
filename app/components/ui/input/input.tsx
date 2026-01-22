type InputProps = {
  type: string;
  name: string;
  value?: string;
  defaultValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  label?: string;
  required?: boolean;
};

export function Input({
  type,
  value,
  onChange,
  className,
  defaultValue,
  label,
  name,
  required,
}: InputProps) {
  return (
    <label className="font-bold">
      {label}
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={className || "ml-2 border-s-stone-400 border-2 rounded"}
        name={name}
        required={required}
        defaultValue={defaultValue}
      />
    </label>
  );
}

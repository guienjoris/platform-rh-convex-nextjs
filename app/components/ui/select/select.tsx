type Option = {
  value: string;
  label: string;
};

type SelectProps = {
  name: string;
  label: string;
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  defaultValue?: string;
  required?: boolean;
};

export function Select({
  name,
  label,
  options,
  value,
  onChange,
  defaultValue,
  required,
}: SelectProps) {
  return (
    <label className="font-bold">
      {label}
      <select
        className="ml-2 border-s-stone-400 border-2 rounded"
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        defaultValue={defaultValue}
        required={required}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

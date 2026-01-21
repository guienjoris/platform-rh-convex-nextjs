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
};

export function Select({
  name,
  label,
  options,
  value,
  onChange,
  defaultValue,
}: SelectProps) {
  return (
    <label>
      {label}
      <select
        className="ml-2 border-s-stone-400 border-2 rounded"
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        defaultValue={defaultValue}
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

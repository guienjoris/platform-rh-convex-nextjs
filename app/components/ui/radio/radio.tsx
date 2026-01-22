type RadioProps = {
  label: string;
  value: string;
  checked?: boolean;
  className?: string;
  name: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  defaultChecked?: boolean;
};

export function Radio({
  label,
  value,
  checked,
  onChange,
  name,
  defaultChecked,
}: RadioProps) {
  return (
    <label className="flex items-center m-2" htmlFor={value}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={onChange}
      />
      <span className="ml-2">{label}</span>
    </label>
  );
}

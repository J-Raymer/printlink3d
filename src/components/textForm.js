export default function TextForm({
  type,
  placeholder,
  onChange,
  min,
  max,
  step,
  value = null,
  width = 10,
}) {
  return (
    <input
      style={{ width: `${width}rem` }}
      className="shadow appearance-none bg-gray-50 border rounded py-2 px-3 border-gray-300 text-gray-900 text-sm"
      id={type}
      placeholder={placeholder}
      type={type}
      onChange={onChange}
      value={value}
      min={min}
      max={max}
      step={step}
    />
  );
}
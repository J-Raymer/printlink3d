import { useState } from "react";

export default function TextForm({
  type,
  placeholder,
  onChange,
  min,
  max,
  step,
  value,
  width = 10,
  maxLength,
  onKeyDown,
  onBlur,
}) {
  const [currentLength, setCurrentLength] = useState(value.length);

  const handleChange = (e) => {
    setCurrentLength(e.target.value.length);
    onChange(e);
  };

  return (
    <div className="flex flex-col">
      <input
        style={{ width: `${width}rem` }}
        className="shadow appearance-none bg-gray-50 border rounded py-2 px-3 border-gray-300 text-gray-900 text-sm"
        id={type}
        placeholder={placeholder}
        type={type}
        onChange={handleChange}
        value={value}
        min={min}
        max={max}
        maxLength={maxLength}
        step={step}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
      />
      {maxLength && (
        <p className="text-sm text-gray-400">{`${currentLength}/${maxLength} characters`}</p>
      )}
    </div>
  );
}
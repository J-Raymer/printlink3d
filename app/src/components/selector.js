export default function Selector({
  label,
  initValue,
  options,
  onChange,
  padding = 2.5,
}) {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <>
      <select
        name="selector"
        id={label}
        onChange={handleChange}
        className={`shadow w-40 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block p-${padding}`}
      >
        {options.map((option, index) =>
          option === initValue ? (
            <option key={index} value={option} selected>
              {option}
            </option>
          ) : (
            <option key={index} value={option}>
              {option}
            </option>
          )
        )}
      </select>
    </>
  );
}

export default function Selector({label, options, onChange, padding = 2.5}) {
    const handleChange = (event) => {
      onChange(event.target.value)
    }
  
    return (
      <>
        <select name="selector" id={label} onChange={handleChange}
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-${padding}`}>
              {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
              ))}
        </select>
      </>
    )
  }
export default function Selector({label, options, onChange}) {
    const handleChange = (event) => {
      onChange(event.target.value)
    }
  
    return (
      <>
        <select name="selector" id={label} onChange={handleChange}
                className="w-40 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5">
              {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
              ))}
        </select>
      </>
    )
  }
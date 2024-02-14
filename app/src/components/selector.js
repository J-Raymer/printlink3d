export default function Selector({label, options, onChange}) {
    const handleChange = (event) => {
      onChange(event.target.value)
    }
  
    return (
      <>
        <select name="selector" id={label} onChange={handleChange}
        className="block appearance-none bg-blue-500 hover:bg-blue-700 border border-blue-500 text-white font-bold py-2 px-4 rounded leading-tight focus:outline-none focus:bg-blue-700">
              {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
              ))}
        </select>
      </>
    )
  }
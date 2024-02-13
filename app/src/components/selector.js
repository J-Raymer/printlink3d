export default function Selector({label, options, onChange}) {
    const handleChange = (event) => {
      onChange(event.target.value)
    }
  
    return (
      <>
        <select name="selector" id={label} onChange={handleChange}>
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
              ))}
        </select>
      </>
    )
  }
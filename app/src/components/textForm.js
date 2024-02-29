export default function TextForm({type, placeholder, onChange, pattern, min, max, step, value=null}) {
  return(
      <input className="shadow appearance-none w-40 bg-gray-50 border rounded py-2 px-3  border-gray-300 text-gray-900 text-sm " 
                          id={type}  placeholder={placeholder} type={type} onChange={onChange}
                          pattern={pattern} value={value} min={min} max={max} step={step}/>
    )
  }
  

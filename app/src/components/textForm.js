export default function TextForm({type, placeholder, onChange, pattern, min, max, step, value=null}) {
  return(
      <input className="shadow appearance-none w-40 border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                          id={type}  placeholder={placeholder} type={type} onChange={onChange}
                          pattern={pattern} value={value} min={min} max={max} step={step}/>
    )
  }
  

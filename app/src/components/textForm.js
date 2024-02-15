export default function TextForm({type, placeholder, onChange}) {
    return(
      <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                          id={type} required 
                          placeholder={placeholder} type={type} onChange={onChange}/>
    )
  }
  
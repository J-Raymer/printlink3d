export default function Slider({label, init, onChange, min=0, max=100, step=5}) {
    const handleChange = (event) => {
      onChange(event.target.value);
    }
    
    return (
      <>
        <input type="range" name="slider" min={min} max={max}
               id={label} value={init} step={step} onChange={handleChange}
               className="appearance-none w-40 bg-white-500 hover:bg-blue-700 h-2 border border-blue-500 rounded focus:outline-none focus:border-blue-700"/>

      </> 
    )
  }
export default function Slider({label, init, onChange, step=5, markers=[]}) {
    const handleChange = (event) => {
      onChange(event.target.value);
    }
    
    return (
      <>
        <input type="range" name="slider" list="markers" 
               id={label} value={init} step={step} onChange={handleChange} />
  
        <datalist id="markers">
          {markers.map((marker) => (
            <option value={marker}></option>
          ))}
        </datalist>
      </> 
    )
  }
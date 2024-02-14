
import Selector from "../components/selector";
import Slider from "../components/slider";
import HelpButton from "../components/helpButton";

function StyledLine({ title, inputValue, inputUnits, inputComponent, helpButtonComponent}) {
  return (
    <div  className="border-b border-gray-300 pb-2">
      <div className="p-2 grid grid-cols-4 gap-2">
        <h4 className="text-lg font-semibold">{title} </h4>
        <div className="flex items-center">
          <span className="mr-1">{inputValue} {inputUnits}</span>
        </div>
        <div className="flex justify-center items-center">
          {inputComponent}
        </div>
        {helpButtonComponent}
      </div>
        
        
      
    </div>
  );
}

function TextForm({type, placeholder, onChange}) {
  return(
    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        id={type} required 
                        placeholder={placeholder} type={type} onChange={onChange}/>
  )
}

function EmailForm({onChange}) {
  return(
    <TextForm type="email" placeholder="Enter your email" onChange={onChange} />
  )
}

function NameForm({onChange}) {
  return(
    <TextForm type="text" placeholder="Enter your name" onChange={onChange} />
  )
}

export default function Configure({printJob, onChange}) {
  const changeDistance = (x) => onChange(x, "distance_km");
  const changeInfill = (x) => onChange(x, "infill");
  const changeMaterial = (x) => onChange(x, "material");
  const changeEmail = (x) => onChange(x, "email");
  const changeName = (x) => onChange(x, "name");

  return (
    <div>
      <div className="p-5">
        <div className="my-4">
          <h2 className="text-3xl font-semibold text-gray-800"> Print Parameters </h2>
        </div>
        <StyledLine title="Printer Distance"
                    inputValue={printJob.distance_km} inputUnits={"km"}
                    inputComponent={<Slider label="distance" init={printJob.distance_km} onChange={changeDistance} step={1} max={20} markers={[0,5,10,15,20]}/>} 
                    helpButtonComponent={<HelpButton helpText={"The distance which you are willing to meet with a printer to exchange $$$$ for prints"}/>} />
        <StyledLine title="Material"
                    inputComponent={<Selector label="material" options={printJob.materials} onChange={changeMaterial} />}
                    helpButtonComponent={<HelpButton helpText={"What type of material your print will be made of"}/>}/>
        <StyledLine title="Infill"
                    inputValue={printJob.infill} inputUnits={"%"}
                    inputComponent={<Slider label="infill" init={printJob.infill} onChange={changeInfill} markers={[0,25,50,75,100]}/>}
                    helpButtonComponent={<HelpButton helpText={"The density of the internal structure of your print"}/>}/>
      </div>
      
      <div className="p-5">
        <div className="my-4">
          <h2 className="text-3xl font-semibold text-gray-800"> Contact Details </h2>
        </div>
        <StyledLine title="Name"
                    inputComponent={<NameForm onChange={changeName} />}
                    helpButtonComponent={<HelpButton helpText={"Your name"}/>}/>
        <StyledLine title="Email"
                    inputComponent={<EmailForm onChange={changeEmail} />}
                    helpButtonComponent={<HelpButton helpText={"Contact email required for coordination with printer"}/>}/>
      </div>
      
    </div>
  );
}



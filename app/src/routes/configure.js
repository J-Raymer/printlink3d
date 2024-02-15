
import Selector from "../components/selector";
import Slider from "../components/slider";
import HelpButton from "../components/helpButton";
import TextForm from "../components/textForm";

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
  const changeDistance = (x) => onChange(parseInt(x), "distance_km");
  const changeInfill = (x) => onChange(parseInt(x), "infill");
  const changeMaterial = (x) => onChange(x, "material");
  const changeEmail = (x) => onChange(x.target.value, "email");
  const changeName = (x) => onChange(x.target.value, "name");

  return (
    <div>
      <div className="p-5">
        <div className="my-4">
          <h2 className="text-3xl font-semibold text-gray-800"> Print Parameters </h2>
        </div>
        <StyledLine title="Printer Distance"
                    inputValue={printJob.distance_km} inputUnits={"km"}
                    inputComponent={<Slider label="distance" init={printJob.distance_km} onChange={changeDistance} step={1} max={20} markers={[0,5,10,15,20]}/>} 
                    helpButtonComponent={<HelpButton helpText={"The distance that you are willing to travel to meet the printer"}/>} />
        <StyledLine title="Material"
                    inputComponent={<Selector label="material" options={printJob.materials} onChange={changeMaterial} />}
                    helpButtonComponent={<HelpButton helpText={"The material used in your print"}/>}/>
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
                    inputComponent={<NameForm onChange={changeName} />}/>
        <StyledLine title="Email"
                    inputComponent={<EmailForm onChange={changeEmail} />}/>
      </div>
    </div>
  );
}



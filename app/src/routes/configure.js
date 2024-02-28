import Selector from "../components/selector";
import Slider from "../components/slider";
import HelpButton from "../components/helpButton";
import TextForm from "../components/textForm";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { firebaseDb } from "../firebase";

function StyledLine({ title, inputValue, inputUnits, inputComponent, helpButtonComponent}) {
  return (
    <div>
      <div className="flex py-6">
          <div className="w-60 flex pl-3">
              <div className="mx-2">
                <div className="text-lg font-semibold">{title} </div>
              </div>
              <div className="">
                  {helpButtonComponent}
              </div>
          </div>
          <div className="">
              {inputComponent}
          </div>
      </div>
    </div>
    
  );
}

export default function Configure({printJob, changePrintJob}) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [materials, setMaterials] = useState([]);
  
  const changeMaterial = (x) => changePrintJob(x, "material");
  const changeColor = (x) => {
    console.log(x)
    changePrintJob(x, "color")
  }
  const changeCompletionDate = (x) => {
    console.log(x.target.valueAsNumber)
    changePrintJob(x.target.valueAsNumber, "completionDate");
  }
  const changeStartingBid = (e) => {
    const newStartingBid = e.target.value;
    (newStartingBid !== "") ?
      changePrintJob(newStartingBid, "startingBid")
      : changePrintJob("0", "startingBid")
  }
  const changeInfill = (x) => changePrintJob(parseInt(x), "infill");
  
  const changeLayerHeight = (e) => {
    const newLayerHeight = e.target.value;
    (newLayerHeight !== "") ?
      changePrintJob(newLayerHeight, "layerHeight")
      : changePrintJob("0.2", "layerHeight")
  };

  //do for colors too
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firebaseDb, 'Material'), (snapshot) => {
      const fetchedMaterials = [];
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        fetchedMaterials.push(data.Type);
        setMaterials(fetchedMaterials);
      });

      changeMaterial(materials[0]);
    })

    return () => {
      unsubscribe(); // Cleanup function to unsubscribe from real-time updates when the component unmounts
    };
  }, []);
  
  return (
    <div>
      <div className="p-5">
        <div className="my-4">
          <h2 className="text-3xl font-semibold text-gray-800"> Print Parameters </h2>
        </div>
        <div className="flex-col">
          <StyledLine title="Material"
                      inputComponent={<Selector label="material" options={materials} onChange={changeMaterial} />}
                      helpButtonComponent={<HelpButton helpText={"The material used in your print"}/>}/>
          <StyledLine title="Color"
                      inputComponent={<Selector label="color" options={["No Preference", "Black", "Grey", "White", "Red", "Yellow", "Green", "Blue"]} onChange={changeColor} />}
                      helpButtonComponent={<HelpButton helpText={"The material color used in your print"}/>}/>
          <StyledLine title="Complete By"
                      inputComponent={<TextForm type="date" value={printJob.completionDate.valueAsDate} onChange={changeCompletionDate}/>}
                      helpButtonComponent={<HelpButton helpText={"The complete by date for your print"}/>}/>
          <StyledLine title="Starting Bid"
                      inputComponent={<TextForm type="number" min="0" step="0.01" value={printJob.startingBid} onChange={changeStartingBid}/>}
                      helpButtonComponent={<HelpButton helpText={"The price you are willing to pay"}/>}/>
        </div>
      </div>
      <div className="p-5">
      <button onClick={() => setShowAdvanced(!showAdvanced)}>
        <div className="flex">
          <div className="pr-3 font-semibold">
            Advanced Options
          </div>
          {showAdvanced ? 
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
              </svg>
            :
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            }
        </div>
      </button>
      {
        showAdvanced ?
          <div className="p-5">
            <div className="rounded-lg bg-slate-50">
              <StyledLine title="Infill Density"
                      inputValue={printJob.infill} inputUnits={"%"}
                      inputComponent={<Slider label="infill" init={printJob.infill} onChange={changeInfill}/>}
                      helpButtonComponent={<HelpButton helpText={"The density of the internal structure of your print"}/>}/>
               <StyledLine title="Layer Height"
                      inputValue={printJob.layerHeight} inputUnits={"mm"}
                      inputComponent={<TextForm type="number" min="0.1" max="0.32" step="0.01" value={printJob.layerHeight} onChange={changeLayerHeight}/>}
                      helpButtonComponent={<HelpButton helpText={"The density of the internal structure of your print"}/>}/>
            </div>
          </div>
        :
          <div />
      }
      </div>
    </div>
  );
}



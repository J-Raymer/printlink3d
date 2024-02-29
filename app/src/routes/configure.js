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

function TextArea({value, onChange}) {
  return (
    <div className="">
      <textarea class="px-2 py-1 bg-gray-50 border border-gray-300 text-gray-900 rounded-md focus:ring-blue-500 focus:border-blue-500 block" 
                value={value} onChange={onChange} rows="4" cols="50"/>
    </div>
  );
}

function MaterialSelector({init, materials, changeMaterial}) {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedItem, setSelectedItem] = useState(init);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    changeMaterial(item.Type)
  };

  return (
    <div>
      <button onClick={() => setShowOptions(true)}>
        <div className="flex">
          {showOptions ? 
              materials.map((m,idx) => {
                return (
                  <div className="pr-3">
                    <div key={idx} onClick={() => handleItemClick(m)} 
                        className={`rounded-md px-2 py-1 cursor-pointer transform transition-transform duration-200
                                   ${selectedItem.Type === m.Type ? 'bg-blue-200' : 'bg-gray-100'}`}>
                      <div className="relative group">
                        <div className="w-96 absolute hidden bg-white border border-gray-300 p-2 mt-7 group-hover:block z-10">
                          <p className="text-left text-sm">
                            {m.Description}
                          </p>
                        </div>
                        {m.Type}
                      </div>
                    </div>
                  </div>
                )
              })
            :
              <div className="flex">
                <div className="pr-3">
                  <div className="rounded-md px-2 py-1 cursor-pointer bg-blue-200">
                    {selectedItem.Type}
                  </div> 
                </div>
                <div className="pr-3 flex">
                <div className="rounded-md px-2 py-1 cursor-pointer bg-white">
                  More Material Options
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="pt-2 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
                </div>
              </div>
            }
        </div>
      </button>
    </div>
  )
}

export default function Configure({printJob, changePrintJob}) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [materials, setMaterials] = useState([]);
  
  const changeQuantity = (x) => changePrintJob(x.target.value, "quantity")
  const changeMaterial = (x) => {
    changePrintJob(x, "material");
  }
  const changeColor = (x) => {
    changePrintJob(x, "color")
  }
  const changeCompletionDate = (x) => {
    changePrintJob(x.target.valueAsNumber, "completionDate");
  }
  const changeComment = (e) => {
    const newComment = e.target.value
    changePrintJob(newComment, "comment")
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
        fetchedMaterials.push(data);
        setMaterials(fetchedMaterials);
      });
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
          <StyledLine title="Quantity"
                      inputComponent={<TextForm type="number" min="1" value={printJob.quantity} onChange={changeQuantity}/>}/>
          <StyledLine title="Complete By"
                      inputComponent={<TextForm type="date" value={printJob.completionDate.valueAsDate} onChange={changeCompletionDate}/>}
                      helpButtonComponent={<HelpButton helpText={"The complete by date for your print"}/>}/>
          <StyledLine title="Color"
                      inputComponent={<Selector label="color" options={["No Preference", "Black", "Grey", "White", "Red", "Yellow", "Green", "Blue"]} onChange={changeColor} />}
                      helpButtonComponent={<HelpButton helpText={"The material color used in your print"}/>}/>
          <StyledLine title="Material"
                      inputComponent={<MaterialSelector init={{Type: printJob.material}} materials={materials} changeMaterial={changeMaterial}/>}
                      helpButtonComponent={<HelpButton helpText={"The material used in your print"}/>}/>
          <StyledLine title="Comment" 
                      inputComponent={<TextArea value={printJob.comment} onChange={changeComment}/>}/>
          
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



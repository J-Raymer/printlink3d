import { useState } from "react";
import { Link } from "react-router-dom";
import MultiStepForm from "../components/multistepform";
import MultiStepFormPage from "../components/multistepformpage";
import Configure from "./configure";
import ConfirmPrint from "./confirmPrint"



export default function Create() {
  const materials = ["PLA", "ABS"]
  const emptyPrintJob = {file:null, 
                         distance_km:5,
                         material:materials[0],
                         materials:materials,
                         infill:25,
                         email:null,
                         name:null};
  const [printJob,setPrintJob] = useState(emptyPrintJob);

  const updatePrintJob = (value, property) => {
    setPrintJob({...printJob, [property]:value});
  }


  return (
    <div>
      <h1 className="text-4xl font-extrabold p-6 pl-4">Create</h1>
      <MultiStepForm submitText="Submit Job">
        <MultiStepFormPage title="Upload">
          <h1>Step 1</h1>
        </MultiStepFormPage>
        <MultiStepFormPage title="Configure">
          <Configure printJob={printJob} onChange={updatePrintJob}/>
        </MultiStepFormPage>
      </MultiStepForm>
      <Link to="/">Back</Link>
    </div>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MultiStepForm from "../components/multistepform";
import MultiStepFormPage from "../components/multistepformpage";
import Configure from "./configure";
import Upload from "./upload";
import { firebaseDb } from "../firebase";
import { AddJob } from "../backend";


export default function Create() {
    const navigate = useNavigate();
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

    const onJobSubmit = () => {
      const db_entry = {
        Customer_ID: 1,
        Fill_Percentage: printJob.infill,
        ID: 1,
        Material: printJob.material,
        Printer_ID: 1,
        Radius: printJob.distance_km,
        STL: "",
        Status: false
      };
      
      AddJob(firebaseDb,db_entry);
      navigate('/');
    }

  return (
    <div>
      <p className="text-4xl font-extrabold p-6 pl-4">Create</p>
      <MultiStepForm submitText="Submit Job" showNext={printJob.file !== null} validDetails={printJob.email !== null && printJob.name !== null} handleSubmit={onJobSubmit}>
        <MultiStepFormPage title="Upload">
          <Upload printJob={printJob} updateFile={(newFile) => updatePrintJob(newFile, "file")}/>
        </MultiStepFormPage>
        <MultiStepFormPage title="Configure">
          <Configure printJob={printJob} onChange={updatePrintJob}/>
        </MultiStepFormPage>
      </MultiStepForm>
      <Link to="/">Back</Link>
    </div>
  );
}

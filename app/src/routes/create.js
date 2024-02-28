import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MultiStepForm from "../components/multistepform";
import MultiStepFormPage from "../components/multistepformpage";
import Configure from "./configure";
import Upload from "./upload";

export default function Create() {
    const navigate = useNavigate();

    const emptyPrintJob = {
      file:null,
      material:null,
      color:"No Preference",
      completionDate:0,
      startingBid:null,
      infill:25,
      layerHeight:null
    };
    
    const [printJob, setPrintJob] = useState(emptyPrintJob);  
    
    const updatePrintJob = (value, property) => {
      setPrintJob(prevState => ({...prevState, [property]:value}));
    }
    
    const onJobSubmit = () => {
      const db_entry = {
        Customer_ID: 1,
        Fill_Percentage: printJob.infill,
        ID: 1,
        Material: printJob.material,
        Printer_ID: 1,
        Radius: printJob.distance_km,
        STL: printJob.file.name,
        Name: printJob.name,
        Email: printJob.email,
        Status: false
      };
      
      console.log(printJob);
      //AddJob(firebaseDb, db_entry);
      //navigate('/');
    }

  return (
    <div>
      <MultiStepForm 
        submitText="Submit Job"
        showNext={printJob.file !== null}
        validDetails={printJob.email !== null && printJob.name !== null}
        handleSubmit={onJobSubmit}
      >
        <MultiStepFormPage title="Upload">
          <Upload printJob={printJob} updateFile={(newFile) => updatePrintJob(newFile, "file")}/>
        </MultiStepFormPage>
        <MultiStepFormPage title="Configure">
          <Configure printJob={printJob} changePrintJob={updatePrintJob}/>
        </MultiStepFormPage>
      </MultiStepForm>
    </div>
  );
}

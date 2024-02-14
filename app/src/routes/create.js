import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import MultiStepForm from "../components/multistepform";
import MultiStepFormPage from "../components/multistepformpage";
import Configure from "./configure";
import ConfirmPrint from "./confirmPrint"

import { useDropzone } from 'react-dropzone';

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

    const changeFile = (x) => updatePrintJob(x, "file");

    const onDrop = useCallback((uploadedFiles) => {
      changeFile(uploadedFiles[0]);
    }, []);

    const { getRootProps, getInputProps, open } = useDropzone({
      onDrop,
      accept: {
        'model/stl': ['.stl'],
      },
      noClick: true,
      noKeyboard: true,
      maxFiles: 1,
    });

  return (
    <div>
      <p className="text-4xl font-extrabold p-6 pl-4">Create</p>
      <MultiStepForm submitText="Submit Job" showNext={printJob.file !== null}>
        <MultiStepFormPage title="Upload">
          <div className="flex justify-center">
            <p className="text-4xl font-bold mb-5">Upload an stl file</p>
          </div>
          {
            printJob.file === null ?
              <div className="h-1/2">
                <div {...getRootProps()} className="h-full border-dashed border-2 border-gray-400 p-4 flex text-center justify-center items-center">
                  <input {...getInputProps()} />
                  <div className="text-3xl">
                    <p>Drag and drop<br/>or</p>
                    <span onClick={open} className="text-3xl text-blue-500 cursor-pointer underline">Browse files</span>
                  </div>
                </div>
              </div>
            :
            <div className="flex flex-col items-center justify-center h-full h-2/3">
              <div className="flex items-center mb-5 text-4xl">
                  <p className="mr-2">Selected: {printJob.file.name}</p>
              </div>
              <div className="flex items-center">
                  <p onClick={() => changeFile(null)} className="text-3xl text-blue-500 cursor-pointer underline">Change</p>
              </div>
          </div>
          }
        </MultiStepFormPage>
        <MultiStepFormPage title="Configure">
          <Configure printJob={printJob} onChange={updatePrintJob}/>
        </MultiStepFormPage>
      </MultiStepForm>
      <Link to="/">Back</Link>
    </div>
  );
}

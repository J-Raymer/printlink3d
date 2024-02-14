import { Link } from "react-router-dom";
import MultiStepForm from "../components/multistepform";
import MultiStepFormPage from "../components/multistepformpage";
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

export default function Create() {
  const [file, setFile] = useState(null)

  // TODO prevent multiple files from being accepted
  const onDrop = useCallback((uploadedFiles) => {
    setFile(uploadedFiles[0]);
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
      <MultiStepForm submitText="Submit Job">
        <MultiStepFormPage title="Upload">
          <div className="flex justify-center">
            <p className="text-4xl bold mb-5">Upload an stl file</p>
          </div>
          {
            file === null ?
              <div className="h-1/2">
                <div className="h-full border-dashed border-2 border-gray-400 p-4 flex text-center justify-center items-center">
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                      <p className="text-3xl">Drag and drop</p>
                      <p className="text-3xl">or</p>
                      <span onClick={open} className="text-3xl text-blue-500 cursor-pointer underline">Browse files</span>
                  </div>
                </div>
              </div>
            :
            <div className="flex flex-col items-center justify-center h-full h-2/3">
              <div className="flex items-center mb-5">
                  <p className="text-4xl font-bold mr-2">Selected:</p>
                  <p className="text-4xl font-bold">{file.name}</p>
              </div>
              <div className="flex items-center">
                  <p onClick={() => setFile(null)}className="text-3xl text-blue-500 cursor-pointer underline">Change</p>
              </div>
          </div>
          }
        </MultiStepFormPage>
        <MultiStepFormPage title="Configure">
          <p>Step 2</p>
        </MultiStepFormPage>
      </MultiStepForm>
      <Link to="/">Back</Link>
    </div>
  );
}

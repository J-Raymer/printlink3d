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
      <h1 className="text-4xl font-extrabold p-6 pl-4">Create</h1>
      <MultiStepForm submitText="Submit Job">
        <MultiStepFormPage title="Upload">
          {
            file === null ?
              <div className="h-1/2 w-full flex justify-center items-center">
                <div className="h-full w-full border-dashed border-2 border-gray-400 p-4 text-center justify-center" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                      <p className="text-3xl">Drag and drop</p>
                      <p className="text-3xl">or</p>
                      <span onClick={open} className="text-3xl text-blue-500 cursor-pointer underline">Browse files</span>
                  </div>
                </div>
              </div>
            :
            <div>Hello World</div>
          }
        </MultiStepFormPage>
        <MultiStepFormPage title="Configure">
          <h1>Step 2</h1>
        </MultiStepFormPage>
      </MultiStepForm>
      <Link to="/">Back</Link>
    </div>
  );
}

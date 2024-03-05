import { useDropzone } from 'react-dropzone';
import FileCard from '../components/fileCard'
import { useState } from 'react';

export default function Upload({printJob, updateFile}) {
    const [uploaded, setUploaded] = useState((printJob.file !== null));
    
    const onDrop = (files) => {
      updateFile(files[0])
      setUploaded(true)
    };

    const onCancel = () => {
      updateFile(null)
      setUploaded(false)
    }
    

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
        <>
        <div className="flex justify-center">
            <p className="text-4xl font-bold">Upload an stl file</p>
          </div>
          {
            !uploaded ?
              <div className="h-1/2 mt-10">
                <div {...getRootProps()} className="h-full border-dashed border-2 border-gray-400 p-4 flex text-center justify-center items-center">
                  <input {...getInputProps()} />
                  <div className="text-3xl">
                    <p>Drag and drop<br/>or</p>
                    <span onClick={open} className="text-3xl text-blue-500 cursor-pointer underline">Browse files</span>
                  </div>
                </div>
              </div>
            :
              <div className="py-4 px-10">
                <FileCard file={printJob.file} onClick={onCancel} />
              </div>
          }
        </>
    );
}
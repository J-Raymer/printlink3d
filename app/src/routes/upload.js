import { useDropzone } from 'react-dropzone';

export default function Upload({printJob, updateFile}) {
    
    const onDrop = (files) => updateFile(files[0]);

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
            printJob.file === null ?
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
              <div className="flex flex-col items-center justify-center h-full mt-5">
                <div className="flex items-center mb-5 text-4xl">
                    <p className="mr-2">Selected: {printJob.file.name}</p>
                </div>
                <div className="flex items-center">
                    <p onClick={() => updateFile(null)} className="text-3xl text-blue-500 cursor-pointer underline">Change</p>
                </div>
              </div>
          }
        </>
    );
}
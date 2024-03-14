import { useContext, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import MultiStepForm from "../components/multistepform";
import MultiStepFormPage from "../components/multistepformpage";
import Configure from "./configure";
import Upload from "./upload";
import { AddJob } from "../backend";
import { firebaseDb } from "../firebase/firebase";
import { useAuth } from "../contexts/authContext/index";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function Create() {
  const navigate = useNavigate();
  const userContext = useAuth();

  const emptyPrintJob = {
    file: null,
    quantity: 1,
    material: "Plastic",
    color: "No Preference",
    completionDate: "",
    comment: "",
    infill: "25%",
    layerHeight: "0.2 mm",
  };

  const [printJob, setPrintJob] = useState(emptyPrintJob);

  const updatePrintJob = (property, value) => {
    setPrintJob((prevState) => ({ ...prevState, [property]: value }));
  };

  const getDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  const onJobSubmit = () => {
    const storage = getStorage();
    const storageRef = ref(storage, 'print-files/' + printJob.file.name);

    const uploadTask = uploadBytesResumable(storageRef, printJob.file);

    uploadTask.on('state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        console.log(error);
      },
      () => {
        // Handle successful uploads on complete
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);

          const db_entry = {
            CustomerUid: userContext.currUser.uid,
            PrinterUid: null,
            File: downloadURL,
            Quantity: printJob.quantity,
            Material: printJob.material,
            Color: printJob.color,
            CompletionDate: printJob.completionDate,
            Comment: printJob.comment,
            Infill: printJob.infill,
            LayerHeight: printJob.layerHeight,
            History: {
              'Submitted': getDate(),
              'Accepted': null,
              'Printed': null,
              'Exchanged': null,
            },
            Complete: false
          };

          AddJob(firebaseDb, db_entry)
            .then((jobRef) => { navigate(`/Orders/${jobRef.id}`) });
        });
      }
    );
  };

  return (
    <div>
      {!userContext.userLoggedIn && <Navigate to={"/login"} replace={true} />}

      <MultiStepForm
        submitText="Submit Job"
        showNext={printJob.file !== null}
        validDetails={printJob.email !== null && printJob.name !== null}
        handleSubmit={onJobSubmit}
      >
        <MultiStepFormPage title="Upload">
          <Upload
            printJob={printJob}
            updateFile={(newFile) => updatePrintJob("file", newFile)}
          />
        </MultiStepFormPage>
        <MultiStepFormPage title="Configure">
          <Configure printJob={printJob} changePrintJob={updatePrintJob} />
        </MultiStepFormPage>
      </MultiStepForm>
    </div>
  );
}

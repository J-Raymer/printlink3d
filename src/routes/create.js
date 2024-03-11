import { useContext, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import MultiStepForm from "../components/multistepform";
import MultiStepFormPage from "../components/multistepformpage";
import Configure from "./configure";
import Upload from "./upload";
import { addJob } from "../backend";
import { firebaseDb } from "../firebase/firebase";
import { useAuth } from "../contexts/authContext/index"

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

  const updatePrintJob = (value, property) => {
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
    //prompt user to create an account

    const db_entry = {
      CustomerUid: userContext.currUser.uid,
      PrinterUid: null,
      File: printJob.file.name,
      Quantity: printJob.quantity,
      Material: printJob.material,
      Color: printJob.color,
      CompletionDate: printJob.completionDate,
      Comment: printJob.comment,
      Infill: printJob.infill,
      LayerHeight: printJob.layerHeight,
      History: {'Submitted':getDate(),
                'Accepted':null,
                'Printed':null,
                'Exchanged':null,},
      Complete: false
    };

    addJob(firebaseDb, db_entry)
    .then((jobRef) => {navigate(`/Orders/${jobRef.id}`)});
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
            updateFile={(newFile) => updatePrintJob(newFile, "file")}
          />
        </MultiStepFormPage>
        <MultiStepFormPage title="Configure">
          <Configure printJob={printJob} changePrintJob={updatePrintJob} />
        </MultiStepFormPage>
      </MultiStepForm>
    </div>
  );
}

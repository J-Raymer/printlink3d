import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MultiStepForm from "../components/multistepform";
import MultiStepFormPage from "../components/multistepformpage";
import Configure from "./configure";
import Upload from "./upload";
import { AddJob } from "../backend";
import { firebaseDb, firebaseStorage } from "../firebase/firebase";
import { ref, uploadBytes } from "firebase/storage"

export default function Create() {
  const navigate = useNavigate();

  const emptyPrintJob = {
    snap: null,
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

  const uploadSnap = async (snap, id) => {
    var storageRef = ref(firebaseStorage, `images/${id}.png`)
    const r = await fetch(snap);
    const b = await r.blob();
    uploadBytes(storageRef, b);
  }

  const onJobSubmit = () => {
    const db_entry = {
      File: printJob.file.name,
      Quantity: printJob.quantity,
      Material: printJob.material,
      Color: printJob.color,
      CompletionDate: printJob.completionDate,
      Comment: printJob.comment,
      Infill: printJob.infill,
      LayerHeight: printJob.layerHeight,
    };
    //upload snapshot
    AddJob(firebaseDb, db_entry)
    .then((jobRef) => uploadSnap(printJob.snap, jobRef.id));
    navigate("/");
  };

  return (
    <div>
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
            updateSnap={(newSnap) => updatePrintJob(newSnap, "snap")}
          />
        </MultiStepFormPage>
        <MultiStepFormPage title="Configure">
          <Configure printJob={printJob} changePrintJob={updatePrintJob} />
        </MultiStepFormPage>
      </MultiStepForm>
    </div>
  );
}

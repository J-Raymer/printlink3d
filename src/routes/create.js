import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import MultiStepForm from "../components/multistepform";
import MultiStepFormPage from "../components/multistepformpage";
import Configure from "./configure";
import Upload from "./upload";
import { addJob } from "../backend";
import { firebaseDb, firebaseStorage } from "../firebase/firebase";
import { ref, uploadBytes, getStorage, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { doc, updateDoc } from "firebase/firestore"
import { useAuth } from "../contexts/authContext/index"

export default function Create() {
  const navigate = useNavigate();
  const userContext = useAuth();

  const emptyPrintJob = {
    thumbnail: null,
    jobName: "",
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
    console.log(property, value);
    setPrintJob((prevState) => ({ ...prevState, [property]: value }));
  };

  const updateFile = (newFile) => {
    updatePrintJob("file", newFile)
    if (newFile !== null) {
      // Strips the .stl extension from the file name
      updatePrintJob("jobName", newFile.name.replace(/\.stl$/i, ""));
    } else {
      updatePrintJob("jobName", "");
    }
  }

  const uploadThumbnail = async (thumbnail, id) => {
    var storageRef = ref(firebaseStorage, `images/${id}.png`)
    const thumbnailResource = await fetch(thumbnail);
    const thumbnailBlob = await thumbnailResource.blob();
    uploadBytes(storageRef, thumbnailBlob);
  };

  const uploadStl = async (stlFile, id) => {
    var storageRef = ref(firebaseStorage, `print-files/${id}.stl`);
    uploadBytes(storageRef, stlFile);
  }

  const getDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const onJobSubmit = () => {
    const db_entry = {
      CustomerUid: userContext.currUser.uid,
      PrinterUid: null,
      FileName: printJob.file.name,
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
      UploadedFile: false,
      Complete: false
    };

    addJob(firebaseDb, db_entry)
      .then((jobRef) => {
        const Id = jobRef.id;

        //upload thumbnail. Needs to be done before navigating to order page
        uploadThumbnail(printJob.thumbnail, Id)
        .then(() => {
          // upload stl file. On completion, make listing available on jobs page
          uploadStl(printJob.file, Id)
          .then(() => {
            const docRef = doc(firebaseDb, `Jobs/${Id}`);
            updateDoc(docRef, {UploadedFile: true})
          })
          .catch(error => {
            console.error("Error uploading stl file: ", error);
          })

          navigate(`/Orders/${Id}`);
        })
        .catch(error => {
          console.error("Error uploading thumbnail: ", error);
        })
      })
      .catch(error => {
        console.error("Error uploading job data: ", error);
      })      
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
            updateFile={(newFile) => updateFile(newFile)}
            updateThumbnail={(newThumbnail) => updatePrintJob("thumbnail", newThumbnail)}
          />
        </MultiStepFormPage>
        <MultiStepFormPage title="Configure">
          <Configure printJob={printJob} changePrintJob={updatePrintJob} />
        </MultiStepFormPage>
      </MultiStepForm>
    </div>
  );
}

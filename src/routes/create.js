import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore"
import { useNavigate, Navigate } from "react-router-dom";
import MultiStepForm from "../components/multistepform";
import MultiStepFormPage from "../components/multistepformpage";
import Configure from "./configure";
import Upload from "./upload";
import { addJob, uploadThumbnail, uploadStl } from "../backend";
import { firebaseDb } from "../firebase/firebase";
import { useAuth } from "../contexts/authContext/index";
import { getDate } from "../utils";

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
    radius: 0,
    latitude: 0,
    longitude: 0,
  };

  const updateFile = (newFile) => {
    updatePrintJob("file", newFile)
    if (newFile !== null) {
      // Strips the .stl extension from the file name and limits it to 100 characters
      updatePrintJob("jobName", newFile.name.replace(/\.stl$/i, "").substring(0, 100));
    } else {
      updatePrintJob("jobName", "");
    }
  }

  const [printJob, setPrintJob] = useState(emptyPrintJob);

  const updatePrintJob = (property, value) => {
    console.log(property, value);
    setPrintJob((prevState) => ({ ...prevState, [property]: value }));
  };

  const onJobSubmit = () => {
    const db_entry = {
      CustomerUid: userContext.currUser.uid,
      PrinterUid: null,
      BidderUid: [],
      FileName: printJob.file.name,
      JobName: printJob.jobName,
      Quantity: (printJob.quantity === "") ? "1" : printJob.quantity,
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
      AcceptedBid: null,
      Complete: false,
      //Broken when merging main
      //Radius: printJob.radius,
      //Latitude: printJob.latitude,
      //Longitude: printJob.longitude,
    };

    addJob(firebaseDb, db_entry)
      .then((jobRef) => {
        const Id = jobRef.id;

        //upload thumbnail. Needs to be done before navigating to order page
        uploadThumbnail(printJob.thumbnail, Id)
        .then(() => {
          // upload stl file. On completion, make listing available on jobs page
          uploadStl(printJob.file, printJob.jobName, Id)
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

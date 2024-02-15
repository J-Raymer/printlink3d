import { Link } from "react-router-dom";
import MultiStepForm from "../components/multistepform";
import MultiStepFormPage from "../components/multistepformpage";
import JobCard from "../components/JobCard";
import JobCardList from "../components/JobCardList";

//todo: remove temp data

let tempJobs = [
  {
    id: 1,
    title: "test title",
    infill: "25%",
    material: "PLA",
    image: "https://picsum.photos/200/300",
  },
];

//todo change render logic for jobcardlist
export default function Browse() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold p-6 pl-4">Browse</h1>
      <MultiStepForm submitText="Accept Job">
        <MultiStepFormPage title="Select Print">
          <h1>Step 1</h1>
          <JobCardList jobs={tempJobs} />
        </MultiStepFormPage>
        <MultiStepFormPage title="Confirm">
          <h1>Step 2</h1>
        </MultiStepFormPage>
      </MultiStepForm>
      <Link to="/">Back</Link>
    </div>
  );
}

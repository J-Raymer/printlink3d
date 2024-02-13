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
    description: "test description",
    image: "https://picsum.photos/200/300",
  },
  {
    id: 2,
    title: "test title",
    description: "test description",
    image: "https://picsum.photos/200/300",
  },
  {
    id: 3,
    title: "test title",
    description: "test description",
    image: "https://picsum.photos/200/300",
  },
  {
    id: 4,
    title: "test title",
    description: "test description",
    image: "https://picsum.photos/200/300",
  },
  {
    id: 5,
    title: "test title",
    description: "test description",
    image: "https://picsum.photos/200/300",
  },
  {
    id: 6,
    title: "test title",
    description: "test description",
    image: "https://picsum.photos/200/300",
  },
  {
    id: 7,
    title: "test title",
    description: "test description",
    image: "https://picsum.photos/200/300",
  },
  {
    id: 8,
    title: "test title",
    description: "test description",
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

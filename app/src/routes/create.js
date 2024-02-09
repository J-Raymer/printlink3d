import { Link } from "react-router-dom";
import MultiStepForm from "../components/multistepform";
import MultiStepFormPage from "../components/multistepformpage";

export default function Create() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold p-6 pl-4">Create</h1>
      <MultiStepForm submitText="Submit Job">
        <MultiStepFormPage title="Upload">
          <h1>Step 1</h1>
        </MultiStepFormPage>
        <MultiStepFormPage title="Configure">
          <h1>Step 2</h1>
        </MultiStepFormPage>
      </MultiStepForm>
      <Link to="/">Back</Link>
    </div>
  );
}

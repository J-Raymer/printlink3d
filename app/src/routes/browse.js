import { Link } from "react-router-dom";
import MultiStepForm from "../components/multistepform";
import MultiStepFormPage from "../components/multistepformpage";

export default function Browse() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold p-6 pl-4">Browse</h1>
      <MultiStepForm submitText="Accept Job">
        <MultiStepFormPage title="Select Print">
          <h1>Step 1</h1>
        </MultiStepFormPage>
        <MultiStepFormPage title="Confirm">
          <h1>Step 2</h1>
        </MultiStepFormPage>
      </MultiStepForm>
      <Link to="/">Back</Link>
    </div>
  );
}

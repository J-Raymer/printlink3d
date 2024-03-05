import { Children, useState } from "react";

export default function MultiStepForm({
  children,
  submitText,
  validDetails,
  handleSubmit,
  showNext,
}) {
  const [step, setStep] = useState(0);

  function handleNextStep() {
    setStep(step + 1);
  }

  function handleBackStep() {
    setStep(step - 1);
  }

  // TODO remove step == 2 logic
  function renderBackBtn() {
    if (step == 2) {
      return;
    }

    return step > 0 ? (
      <button
        className="bg-gray-200 border border-gray-400 text-gray-700 font-bold py-2 px-4 rounded mr-2"
        onClick={handleBackStep}
      >
        Back
      </button>
    ) : (
      <button className="bg-gray-200 border border-gray-400 text-gray-700 font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed mr-2">
        Back
      </button>
    );
  }

  // TODO remove children count == 3 logic
  function renderNextOrSubmitBtn() {
    if (Children.count(children) == 3) {
      console.log(step);
      if (step === 0) {
        return showNext ?
          <button className="bg-brand-blue border border-brand-blue text-white font-bold py-2 px-4 rounded" onClick={handleNextStep}>Next</button>
          : <button className="bg-gray-200 border border-gray-400 text-gray-700 font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed mr-2">Next</button>
      }
      else if (step === 1) {
        return <button className="bg-blue-500 hover:bg-blue-700 border border-blue-500 text-white font-bold py-2 px-4 rounded" onClick={handleNextStep}>{submitText}</button>
      }
    }
    else if (step < Children.count(children) - 1) {
      return showNext ?
        <button className="bg-brand-blue hover:bg-blue-900 border border-brand-blue text-white font-bold py-2 px-4 rounded" onClick={handleNextStep}>Next</button>
        : <button className="bg-gray-200 border border-gray-400 text-gray-700 font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed mr-2">Next</button>
    }
    else {
      return validDetails ?
          <button className="bg-blue-500 hover:bg-blue-700 border border-blue-500 text-white font-bold py-2 px-4 rounded" onClick={handleSubmit}>{submitText}</button>
        : <button className="bg-gray-200 border border-gray-400 text-gray-700 font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed mr-2">{submitText}</button>
    }
  }

  return (
    <div className="full-screen flex rounded-lg relative divide-x divide-gray-300">
      <div className="md:flex flex-col w-[300px] p-2 mt-2">
        {
          Children.map(children, (child, idx) => {
            if (idx === step) {
              return (
                <div className="flex block font-bold p-3 rounded-lg brand-blue-accent">
                  <div className="inline-block mr-2">
                    <span className="flex w-7 h-7 text-md items-center justify-center rounded-full border border-2 border-brand-blue">{idx + 1}</span>
                  </div>
                  <span className="inline text-xl">{child.props.title}</span>
                </div>
              )
            } else {
              return (
                <div className="flex block font-bold p-3">
                  <div className="inline-block mr-2">
                    <span className="flex h-7 w-7 text-md items-center justify-center rounded-full border border-2 border-black">{idx + 1}</span>
                  </div>
                  <span className="inline text-xl">{child.props.title}</span>
                </div>
            );
          }
        })}
      </div>
      <div className="flex flex-col grow">
        <div className="p-3 h-full-less-bottom-bar">
        {
          Children.map(children, (child, idx) => {
            if (idx === step) {
              return (child)
            }
          })
        }
        </div>
        <div className="pt-2 pb-2 border-t border-gray-300">
          <div className="float-right mr-3">
          {renderBackBtn()}
          {renderNextOrSubmitBtn()}
          </div>
        </div>
      </div>
    </div>
  );
}

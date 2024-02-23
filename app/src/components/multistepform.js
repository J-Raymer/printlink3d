import { Children, useState } from "react";

export default function MultiStepForm({children, submitText, validDetails, handleSubmit, showNext}) {

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

    return step > 0
      ? <button className="bg-gray-200 border border-gray-400 text-gray-700 font-bold py-2 px-4 rounded mr-2" onClick={handleBackStep}>Back</button>
      : <button className="bg-gray-200 border border-gray-400 text-gray-700 font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed mr-2">Back</button>
  }

  // TODO remove children count == 3 logic
  function renderNextOrSubmitBtn() {
    if (Children.count(children) == 3) {
      console.log(step)
      if (step === 0) {
        return showNext ?
          <button className="bg-blue-500 hover:bg-blue-700 border border-blue-500 text-white font-bold py-2 px-4 rounded" onClick={handleNextStep}>Next</button>
          : <button className="bg-gray-200 border border-gray-400 text-gray-700 font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed mr-2">Next</button>
      }
      else if (step === 1) {
        return <button className="bg-blue-500 hover:bg-blue-700 border border-blue-500 text-white font-bold py-2 px-4 rounded" onClick={handleNextStep}>{submitText}</button>
      }
    }
    else if (step < Children.count(children) - 1) {
      return showNext ?
        <button className="bg-blue-500 hover:bg-blue-700 border border-blue-500 text-white font-bold py-2 px-4 rounded" onClick={handleNextStep}>Next</button>
        : <button className="bg-gray-200 border border-gray-400 text-gray-700 font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed mr-2">Next</button>
    }
    else {
      return validDetails ?
          <button className="bg-blue-500 hover:bg-blue-700 border border-blue-500 text-white font-bold py-2 px-4 rounded" onClick={handleSubmit}>{submitText}</button>
        : <button className="bg-gray-200 border border-gray-400 text-gray-700 font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed mr-2">{submitText}</button>
    }
  }

  return (
    <div className="h-[90vh] flex rounded-lg border border-gray-300 h-full relative p-4">
      <div className="md:flex flex-col w-56">
        {
          Children.map(children, (child, idx) => {
            if (idx === step) {
              return (
                <div className="block font-bold pl-5 pt-3 pb-3 rounded-lg" style={{ backgroundImage: 'linear-gradient(to bottom, #D799D5, #B5B9F1)' }}>
                  <div className="inline-block mr-2">
                    <span className="flex h-6 w-6 text-md items-center justify-center rounded-full border border-2 border-black">{idx + 1}</span>
                  </div>
                  <span className="inline text-xl">{child.props.title}</span>
                </div>
              )
            } else {
              return (
                <div className="block font-bold pl-5 pt-3 pb-3">
                  <div className="inline-block mr-2">
                    <span className="flex h-6 w-6 text-md items-center justify-center rounded-full border border-2 border-black">{idx + 1}</span>
                  </div>
                  <span className="inline text-xl">{child.props.title}</span>
                </div>
              )
            }
          })
        }
      </div>
      <div className="p-3 flex-grow">
        {
          Children.map(children, (child, idx) => {
            if (idx === step) {
              return (child)
            }
          })
        }
        <div className="absolute bottom-5 right-5">
          {renderBackBtn()}
          {renderNextOrSubmitBtn()}
        </div>
      </div>
    </div>
  );
}

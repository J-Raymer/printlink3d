import Selector from "../components/selector";
import HelpButton from "../components/helpButton";
import TextForm from "../components/textForm";
import { useEffect, useState } from "react";
import { firebaseDb } from "../firebase/firebase";
import { getMaterials } from "../backend";

function StyledLine({ title, inputComponent, helpButtonComponent }) {
  return (
    <div>
      <div className="flex py-6">
        <div className="w-60 flex pl-3">
          <div className="mx-2">
            <div className="text-lg font-semibold">{title} </div>
          </div>
          {helpButtonComponent}
        </div>
        {inputComponent}
      </div>
    </div>
  );
}

function TextArea({ value, onChange }) {
  return (
    <div>
      <textarea
        class="px-2 py-1 bg-gray-50 border border-gray-300 text-gray-900 rounded-md focus:ring-blue-500 focus:border-blue-500 block"
        value={value}
        onChange={onChange}
        rows="4"
        cols="50"
      />
    </div>
  );
}

function MaterialSelector({ init, materials, changeMaterial }) {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedItem, setSelectedItem] = useState(init);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    changeMaterial(item.Type);
  };

  return (
    <div>
      <button onClick={() => setShowOptions(true)}>
        <div className="flex">
          {showOptions ? (
            materials.map((m, idx) => {
              return (
                <div className="pr-3">
                  <div
                    key={idx}
                    onClick={() => handleItemClick(m)}
                    className={`shadow rounded border border-gray-300 text-gray-900 text-sm p-2 cursor-pointer transform transition-transform duration-200
                                    
                                   ${
                                     selectedItem.Type === m.Type
                                       ? "bg-blue-200"
                                       : "bg-gray-50"
                                   }`}
                  >
                    <div className="relative group">
                      <div className="w-96 absolute rounded-sm hidden bg-white border border-gray-300 p-2 mt-8 group-hover:block z-10">
                        <p className="text-left text-sm">{m.Description}</p>
                      </div>
                      {m.Type}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex">
              <div className="pr-3">
                <div className="shadow rounded p-2 cursor-pointer bg-blue-200 border border-gray-300 text-gray-900 text-sm">
                  {selectedItem.Type}
                </div>
              </div>
              <div className="pr-3 flex shadow rounded p-2 cursor-pointer bg-gray-50 border border-gray-300 text-gray-900 text-sm">
                <div className="cursor-pointer text-sm">
                  More Material Options
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="pt-1 pl-1 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
      </button>
    </div>
  );
}

export default function Configure({ printJob, changePrintJob }) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    async function fetchMaterials() {
      setMaterials(await getMaterials(firebaseDb));
    }
    fetchMaterials();
  }, []);

  const changeQuantity = (e) => {
    const newQuantity = e.target.value;
    changePrintJob(newQuantity, "quantity");
  };
  const changeMaterial = (x) => changePrintJob(x, "material");
  const changeColor = (x) => changePrintJob(x, "color");
  const changeCompletionDate = (e) => {
    const newCompletionDate = e.target.value;
    changePrintJob(newCompletionDate, "completionDate");
  };
  const changeComment = (e) => {
    const newComment = e.target.value;
    changePrintJob(newComment, "comment");
  };
  const changeInfill = (x) => changePrintJob(x, "infill");
  const changeLayerHeight = (x) => changePrintJob(x, "layerHeight");

  return (
    <div>
      <div className="p-5">
        <div className="my-4">
          <h2 className="text-3xl font-semibold text-gray-800">
            {" "}
            Print Parameters{" "}
          </h2>
        </div>
        <div className="flex-col">
          <StyledLine
            title="Quantity"
            inputComponent={
              <TextForm
                type="number"
                min="1"
                value={printJob.quantity}
                onChange={changeQuantity}
              />
            }
          />
          <StyledLine
            title="Color"
            inputComponent={
              <Selector
                label="color"
                options={[
                  "No Preference",
                  "Red",
                  "Blue",
                  "Green",
                  "Purple",
                  "Orange",
                  "Yellow",
                  "Brown",
                  "Gray",
                  "Black",
                  "White",
                ]}
                initValue={printJob.color}
                onChange={changeColor}
              />
            }
          />
          <StyledLine
            title="Material"
            inputComponent={
              <MaterialSelector
                init={{ Type: printJob.material }}
                materials={materials}
                changeMaterial={changeMaterial}
              />
            }
            helpButtonComponent={
              <HelpButton
                helpText={
                  "The material used in your print. The plastic option allows the printer to decide, but other options are available."
                }
              />
            }
          />
          <StyledLine
            title="Comment"
            inputComponent={
              <TextArea value={printJob.comment} onChange={changeComment} />
            }
            helpButtonComponent={
              <HelpButton
                helpText={
                  "Enter any additional print details or specifications you want to communicate to the printer."
                }
              />
            }
          />
        </div>
      </div>
      <div className="p-5">
        <button onClick={() => setShowAdvanced(!showAdvanced)}>
          <div className="flex">
            <div className="pr-3 font-semibold">Advanced Options</div>
            {showAdvanced ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m4.5 15.75 7.5-7.5 7.5 7.5"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            )}
          </div>
        </button>
        {showAdvanced ? (
          <div className="p-5">
            <div className="rounded-lg bg-slate-50">
              <StyledLine
                title="Complete By"
                inputComponent={
                  <TextForm
                    type="date"
                    value={printJob.completionDate}
                    onChange={changeCompletionDate}
                  />
                }
                helpButtonComponent={
                  <HelpButton
                    helpText={
                      "The date by which you want your print. You can leave it blank if there is no time constraint."
                    }
                  />
                }
              />
              <StyledLine
                title="Infill Density"
                inputComponent={
                  <Selector
                    options={Array.from(
                      { length: 21 },
                      (_, index) => (index * 5).toString() + "%"
                    )}
                    initValue={printJob.infill}
                    onChange={changeInfill}
                  />
                }
                helpButtonComponent={
                  <HelpButton
                    helpText={
                      "The density of the internal structure of your print. A higher density is stronger but more expensive."
                    }
                  />
                }
              />
              <StyledLine
                title="Layer Height"
                inputComponent={
                  <Selector
                    options={["0.1 mm", "0.2 mm", "0.3 mm"]}
                    initValue={printJob.layerHeight}
                    onChange={changeLayerHeight}
                  />
                }
                helpButtonComponent={
                  <HelpButton
                    helpText={
                      "The height of each print layer. Lower values produce a higher resolution print."
                    }
                  />
                }
              />
            </div>
          </div>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}

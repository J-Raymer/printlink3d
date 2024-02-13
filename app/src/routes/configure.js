import Selector from "../components/selector";
import Slider from "../components/slider";

export default function Configure({printJob, onChange}) {
  const changeInfill = (x) => onChange(x, "infill");
  const changeMaterial = (t) => onChange(t, "material")

  return (
    <div>
      <h1 className="text-4xl font-extrabold p-6 pl-0">Configure!</h1>
      <Slider label="infill" init={printJob.infill} onChange={changeInfill} markers={[0,25,50,75,100]}/>
      <div>Slider is {printJob.infill}</div>
      <Selector label="material" options={printJob.materials} onChange={changeMaterial} />
      <div>Material is {printJob.material}</div>
    </div>
  );
}

import "./jobCard.css";
import boat from "../images/boat.jpg";

export default function JobCard({
  job,
  isSelected,
  onSelectJob,
  onUnselectJob,
  img = boat
}) {
  const handleClick = () => {
    !isSelected ? onSelectJob(job) : onUnselectJob();
  };

  return (
    <div
      onClick={handleClick}
      className={`border-[1px] border-gray-300 bg-white rounded overflow-hidden flex w-full hover:cursor-pointer hover:bg-gray-200 ${
        isSelected ? 'fg-brand-blue brand-blue-accent' : ''
      }`}
      style={{ height: isSelected ? "auto" : "fit-content" }}
    >
      <div className="md:flex-shrink-0">
        <img
          className="h-48 w-full object-cover md:w-48"
          src={img}
          alt={job.fileName}
        />
      </div>
      <div className="pl-5 pt-5 text-gray-600">
        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
          {job.fileName}
        </div>
        <p className="mt-2">
          <span className="font-semibold mt-2">Material: </span>
          <span className="font-normal">{job.material}</span>
        </p>
        <p className="mt-2">
          <span className="font-semibold">Infill: </span>
          <span className="font-normal">{job.infill}</span>
        </p>
        <p className="mt-2">
          <span className="font-semibold">Color: </span>
          <span className="font-normal">{job.color}</span>
        </p>
        <p className="mt-2">
          <span className="font-semibold">Quantity: </span>
          <span className="font-normal">{job.quantity}</span>
        </p>
      </div>
    </div>
  );
}

import boat from "../images/boat.jpg";
import "../app.css";

export default function JobCardOrderPage({
  job,
  isSelected,
  onSelectJob,
  onUnselectJob,
  showDownloadBtn = false,
  file,
}) {
  const handleClick = () => {
    !isSelected ? onSelectJob(job) : onUnselectJob();
  };

  return (
    <div
    onClick={handleClick}
    className={`border-[1px] border-gray-300 bg-white rounded overflow-hidden grid grid-cols-3 w-full hover:cursor-pointer ${isSelected ? 'fg-brand-blue brand-blue-accent' : ''
      }`}
    style={{ height: isSelected ? "auto" : "fit-content" }}
  >
    <div className="col-span-1">
      <img
        className="h-full w-full object-cover"
        src={boat}
        alt={job.fileName}
      />
    </div>
      <div className="col-span-2 pl-5 pt-5 text-gray-600 w-full">
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
        {showDownloadBtn && (
          <a
          href={file}
          download
          className="bg-brand-blue hover:brand-blue-accent text-white font-bold py-2 px-4 w-[95%] mt-2 mb-2 inline-block text-center"
        >
          Download file
        </a>
        )}
      </div>
    </div>
  );
}

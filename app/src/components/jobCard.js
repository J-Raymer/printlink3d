import "./jobCard.css";
import boat from "../images/boat.jpg"

export default function JobCard({ job, isSelected, onSelectJob, onUnselectJob }) {

  const handleClick = () => {
    !isSelected ? onSelectJob(job) : onUnselectJob();
  };

  return (
    <div
      onClick={handleClick}
      className={`max-w-xl mx-auto bg-white shadow-md rounded-lg overflow-hidden md:flex w-full transition-all duration-50 transform hover:scale-105 ${
        isSelected ? 'border-8 border-gradient' : ''
      }`}
      style={{ height: isSelected ? 'auto' : 'fit-content' }}
    >
      <div className="md:flex-shrink-0">
        <img className="h-48 w-full object-cover md:w-48" src={boat} alt={job.fileName} />
      </div>
      <div className="pl-5 pt-5 text-gray-600">
        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{job.fileName}</div>
        <p className="mt-2">
          <span className="font-semibold mt-2">Material: </span><span className="font-normal">{job.material}</span>
        </p>
        <p className="mt-2">
          <span className="font-semibold">Infill: </span><span className="font-normal">{job.infill}</span>
        </p>
        {/* TODO dynamically add Bid and Quantity */}
        <p className="mt-2">
          <span className="font-semibold">Bid: </span><span className="font-normal">$10</span>
        </p>
        <p className="mt-2">
          <span className="font-semibold">Quantity: </span><span className="font-normal">10</span>
        </p>
      </div>
    </div>
  );
}

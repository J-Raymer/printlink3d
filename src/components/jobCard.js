export default function JobCard({
  job,
  isSelected,
  onSelectJob,
  onUnselectJob,
  img
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
        <div className="h-48 w-full object-cover md:w-48">
        {(img)? 
          (<img            
            src={img}
            alt={job.fileName}
          /> )
          :
          (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="gray">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>)
        } 
        </div>
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
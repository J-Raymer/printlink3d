import JobCard from './jobCard'


//computes distance between two points on the earth
function haversine(lat1, lon1, lat2, lon2) {
  const toRadians = (angle) => angle * (Math.PI / 180);
  
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}


export default function JobCardList({ jobs, filters, selectedJob, onSelectJob, onUnselectJob }) {
  return (
    <div className=''>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
      {
        jobs.map((job, i) => {
        console.log('job radius:', job.jobRadius, 'filter radius:', filters["radius"]);
        console.log('job lattitude:', job.jobLat, 'job longitude:', job.jobLng);
        console.log('filter lattitude', filters["latitude"], 'filter longitude',  filters["longitude"]);
        console.log('haversine:', haversine(filters["latitude"], filters["longitude"], job.jobLat, job.jobLng));
        console.log(haversine(filters["latitude"], filters["longitude"], job.jobLat, job.jobLng) <= (filters["radius"] + job.jobRadius));


        if ((filters["materials"].includes(job.material) || job.material == "Plastic") &&
            (filters["colors"].includes(job.color) || job.color == "No Preference") &&
            //Filter for intersecting locations
            ( haversine(filters["latitude"], filters["longitude"], job.jobLat, job.jobLng) <= (filters["radius"] + job.jobRadius) ) ){
          return ( <JobCard
            key={"jobcard-"+i}
            job={job}
            isSelected={selectedJob===job}
            onSelectJob={onSelectJob}
            onUnselectJob={onUnselectJob}
            img={job.thumbnail}
          />);
        }})
      }
      </div>
    </div>
  );
}

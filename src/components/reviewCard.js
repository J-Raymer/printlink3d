import { getFormattedDate } from "../utils";
import "../app.css";

export default function ReviewCard({ review }) {
  const renderStars = () => {
    let rating = review.averageRating;
    let stars = [];
    for (let i = 0; i < 5; i++) {
      if (rating >= 1) {
        stars.push(
          <svg key={i} xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24" strokeWidth={1.5} stroke="black" width="35" height="35">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.73L18.18 22 12 18.27 5.82 22 8 14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        );

      } else if (rating >= 0.5) {
        stars.push(
          <div className="flex">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="35" height="35">
              <defs>
                <clipPath id="half">
                  <rect x="0" y="0" width="12" height="24" />
                </clipPath>
              </defs>
              <path fill="none" stroke="gray" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.73L18.18 22 12 18.27 5.82 22 8 14 2 9.27l6.91-1.01L12 2z" />
              <path fill="black" clipPath="url(#half)" strokeLinecap="round" strokeLinejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.73L18.18 22 12 18.27 5.82 22 8 14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
        );
      } else {
        stars.push(
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="gray" width="35" height="35">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.73L18.18 22 12 18.27 5.82 22 8 14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        )
      }
      rating--;
    }
    return stars;
  }

  return (
    <div className="flex flex-col p-4 border-2 border-brand-blue rounded-lg mb-4">
      <div className="flex items-center">
        {renderStars()}
        <p className="ml-2">{getFormattedDate(review.date)}</p>
      </div>
      {review.comment && <p className="mt-2">{review.comment}</p>}
    </div>
  )
}

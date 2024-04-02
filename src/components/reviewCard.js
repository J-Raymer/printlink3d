import { useState, useEffect } from "react";
import { getUserRatingStats } from "../backend";

export function ReviewCard(props) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    (async () => {
      setStats(await getUserRatingStats(props.userId));
    })();
  }, []);

  return (
    <>
      { stats !== null &&
        <>
        <p className="my-2 fg-brand-blue">{stats.totalRatings} total reviews</p>
        <p>Average Rating: </p>
        <div class="stars" style={{"--rating": `${Number(stats.averageAll) / 5.0}`}}>
          <div class="bg">⭐⭐⭐⭐⭐</div>
        </div>
        <p>Communication: </p>
        <div class="stars" style={{"--rating": `${Number(stats.averageCommunication) / 5.0}`}}>
          <div class="bg">⭐⭐⭐⭐⭐</div>
        </div>
        <p>Exchange: </p>
        <div class="stars" style={{"--rating": `${Number(stats.averageExchange) / 5.0}`}}>
          <div class="bg">⭐⭐⭐⭐⭐</div>
        </div>
        </>
      }
    </>
  );
};
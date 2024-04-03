import default_pfp from "../images/default_pfp.jpg";
import pencil_icon from "../images/pencil.png";
import TextForm from "../components/textForm";
import { useState, useRef } from "react";
import ReviewCard from "../components/reviewCard";
import { getReviewsForUser } from "../backend";
import { firebaseDb } from "../firebase/firebase";
import { useEffect } from "react";
import { useAuth } from "../contexts/authContext";

export default function Profile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [pfp, setPfp] = useState(default_pfp);
  const [reviews, setReviews] = useState([]);
  const fileInputRef = useRef();
  const userContext = useAuth();

  useEffect(() => {
    const fetchReviews = async () => {
      const result = await getReviewsForUser(firebaseDb, userContext.currUser.uid);
      setReviews(result);
    };

    fetchReviews();
  }, []);

  const handleFileSelection = (event) => {
    if (event.target.files.length > 0) {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setPfp(fileReader.result);
      };
      fileReader.readAsDataURL(event.target.files[0]);
    }
  };

  const openFileExplorer = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex w-1/2 mx-auto flex-col mt-10">
      <h2 className="text-2xl font-bold mb-2">My Profile</h2>
      <div className="border-2 w-full border-gray-300 p-2 rounded">
        <p className="text-2xl font-bold">Reviews</p>
        {reviews.map((review) => (
          <ReviewCard review={review} />
        ))}
      </div>
    </div>
  );
}

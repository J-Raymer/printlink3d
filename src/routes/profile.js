import default_pfp from "../images/default_pfp.jpg";
import pencil_icon from "../images/pencil.png";
import TextForm from "../components/textForm";
import { useState, useRef } from "react";
import MapSearch from "../components/mapSearch";
import Review from "../components/review";

export default function Profile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [pfp, setPfp] = useState(default_pfp);
  const fileInputRef = useRef();

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
    <div className="flex mt-10 ml-10">
      <div className="w-32 h-32 overflow-hidden relative">
        <img
          className="w-32 h-32 rounded-full object-cover"
          src={pfp}
          alt="Profile"
        />
        <button
          onClick={openFileExplorer}
          className="absolute bottom-0 left-0 bg-gray-400 pl-2 pr-2 z-10 flex items-center rounded-full"
        >
          <img src={pencil_icon} alt="Edit" className="mr-1 w-4 h-4" />
          Edit
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".png, .jpg, .jpeg"
          style={{ display: "none" }}
          onChange={handleFileSelection}
        />
      </div>
      <div className="w-1/2 ml-10">
        <h2 className="mb-2 mt-5">First Name</h2>
        <TextForm
          type="text"
          value={firstName}
          placeholder="First Name"
          onChange={(x) => setFirstName(x.target.value)}
        />
        <h2 className="mb-2 mt-5">Last Name</h2>
        <TextForm
          type="text"
          value={lastName}
          placeholder="Last Name"
          onChange={(x) => setLastName(x.target.value)}
        />
        <h2 className="mb-2 mt-5">Email</h2>
        <TextForm
          type="email"
          value={email}
          placeholder="Email"
          onChange={(x) => setEmail(x.target.value)}
        />
        <MapSearch />
      </div>
      <div>
        <p className="text-2xl font-bold">Reviews</p>
        <Review />
      </div>
    </div>
  );
}

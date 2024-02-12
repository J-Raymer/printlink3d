import { Link } from "react-router-dom";
import cube_icon from "../images/cube_icon.png";
import printing_icon from "../images/printing_icon.png";
import LargeButton from "../components/largeButton.js"

export default function Home() {
  return (
    <div className="flex justify-between h-screen relative">
      <div className="w-1/2 flex flex-col items-center justify-start">
        <img src={cube_icon} alt="I need printing icon" className="mb-2"/>
        <h1 className="text-8xl">I need printing</h1>
        <Link className="mt-10" to="/create">
          <LargeButton text="List Job"/>
        </Link>
      </div>
      <div className="w-1/2 flex flex-col items-center justify-start">
        <img src={printing_icon} alt="I can print icon" className="mb-2"/>
        <h1 className="text-8xl">I can print</h1>
        <Link className="mt-10" to="/browse">
          <LargeButton text="Browse Jobs"/>
        </Link>
      </div>
      <div className="absolute top-10 bottom-10 left-1/2 transform -translate-x-1/2 bg-blue-300 w-px h-4/5"></div>
    </div>
  );
}

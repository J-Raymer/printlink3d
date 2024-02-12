import { Link } from "react-router-dom";
import cube_icon from "../images/cube_icon.png";
import printing_icon from "../images/printing_icon.png";
import Button from "../components/button.js"

export default function Home() {
  return (
    // <div className="flex items-center justify-center h-screen">
    //   <div className="flex items-center">
    //     <div className="flex flex-col items-center">
    //       <img src={cube_icon} alt="I need printing icon" className="mb-2"/>
    //       <p className="text-center text-8xl font-bold">I need printing</p>
    //     </div>
    //     <div className="w-px h-24 bg-blue-300 mx-8"></div>
    //     <div className="flex flex-col items-center">
    //       <img src={printing_icon} alt="I can print icon" className="mb-2"/>
    //       <p className="text-center text-8xl font-bold">I can print</p>
    //     </div>
    //   </div>
    // </div>
    <div className="flex justify-between h-screen">
      <div className="w-1/2 border-r-2 flex flex-col items-center justify-start">
        <img src={cube_icon} alt="I need printing icon" className="mb-2"/>
        <h1 className="text-8xl">I need printing</h1>
        <Link className="mt-10" to="/create">
          <Button text="List Job"/>
        </Link>
      </div>
      <div className="w-1/2 flex flex-col items-center justify-start">
        <img src={printing_icon} alt="I can print icon" className="mb-2"/>
        <h1 className="text-8xl">I can print</h1>
        <Link className="mt-10" to="/browse">
          <Button text="Browse Jobs"/>
        </Link>
      </div>
    </div>
  );
}

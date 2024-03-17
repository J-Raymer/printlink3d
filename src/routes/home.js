import HomePageStep from "../components/homePageStep";
import printing_home_photo from "../images/3D_printing_home_photo_cropped.jpg";
import printer_photo from "../images/3D_printer.jpg";
import { Link } from "react-router-dom";

export default function Home() {
  const steps = [
    [
      "Upload a 3D model",
      "We accept STL files or a link to ",
      <a
        href="https://www.thingiverse.com/"
        className="text-blue-500"
        target="_blank"
        rel="noopener noreferrer"
      >
        thingiverse
      </a>,
    ],
    [
      "Set your preferences",
      "Customize your print by specifying material, color, and infill",
    ],
    [
      "Submit your order",
      "We’ll connect you with a local 3D printing enthusiast to get your order printed",
    ],
    ["Pickup your order", "Connect with your 3D printer to pickup your print!"],
  ];

  const renderSteps = () => {
    return steps.map((step, index) => (
      <HomePageStep
        key={index}
        step={index + 1}
        title={step[0]}
        text={step.slice(1)}
      />
    ));
  };

  return (
    <div>
      <div className="flex items-center justify-center">
        <div
          className="w-full bg-center bg-cover bg-no-repeat flex flex-col items-center justify-center"
          style={{ backgroundImage: `url(${printing_home_photo})` }}
        >
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl text-white p-10 overflow-hidden">
            3D Printing Made Local
          </h1>
          <Link to="/create" className="bg-custom-purple hover:bg-custom-purple-hover border-black text-white font-bold py-3 px-4 rounded-lg text-2xl sm:text-1xl md:text-2xl lg:text-3xl mb-10">
            Create An Order
          </Link>
        </div>
      </div>
      <div className="text-center mt-5">
        <h1 className="text-4xl font-extrabold">How It Works</h1>
        {renderSteps()}
      </div>
      <div className="flex justify-center mt-10 mb-10">
        <div className="w-4/5 h-0.5 bg-gradient-to-r from-purple-400 to-purple-600"></div>
      </div>
      <div className="text-center mt-5">
        <h1 className="text-4xl font-extrabold">Own a 3D Printer?</h1>
      </div>
      <div className="flex flex-col sm:flex-row mt-5">
        <div className="flex flex-col sm:flex-row items-center">
          <div className="order-2 sm:order-1 mt-5 sm:mt-0">
            <p className="ml-10 text-lg font-medium">
              Select a job in your local area and start making extra money! It’s
              as easy as that.
              <br />
              <br />
              Our mission at PrintLink3D is to connect customers with local 3D
              printing enthusiasts. Interested?
            </p>
            <div className="flex justify-center">
              <Link to="/browse" className="mt-10 bg-custom-purple hover:bg-custom-purple-hover border-black text-white font-bold py-3 px-4 rounded-lg text-2xl sm:text-1xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl">
                Get Started
              </Link>
            </div>
          </div>
          <div className="order-1 sm:order-2">
            <img
              src={printer_photo}
              alt="3D printer"
              className="w-1/2 sm:w-full mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

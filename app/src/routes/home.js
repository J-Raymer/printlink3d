import HomePageStep from '../components/homePageStep';
import printing_home_photo from '../images/3D_printing_home_photo_cropped.jpg';
import printer_photo from '../images/3D_printer.jpg';
import "./home.css";

export default function Home() {
  const steps = [
    ["Upload a 3D model", "We accept STL files or a link to ", <a href="https://www.thingiverse.com/" className="text-blue-500" target="_blank" rel="noopener noreferrer">thingiverse</a>],
    ["Set your preferences", "Customize your print by specifying material, color, and infill"],
    ["Submit your order", "We’ll connect you with a local 3D printing enthusiast to get your order printed"],
    ["Pickup your order", "Connect with your 3D printer to pickup your print!"]];

  const renderSteps = () => {
    return steps.map((step, index) => (
      <HomePageStep
        key={index}
        step={index + 1}
        title={step[0]}
        text={step.slice(1)}
      />
    ));
  }

  return (
    <div>
      <div className="relative text-center">
        <img src={printing_home_photo} alt="3D printing" />
        <div className="absolute w-full top-0 left-0 text-center mt-10">
          <h1 className="absolute mt-20 left-1/2 transform -translate-x-1/2 font-extrabold text-8xl text-white whitespace-nowrap">
            3D Printing Made Local
          </h1>
          <button className="absolute mt-64 left-1/2 transform -translate-x-1/2 bg-custom-purple hover:bg-custom-purple-hover border-black text-white font-bold py-5 px-8 rounded-lg text-4xl">
            Create An Order
          </button>
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
      <div className="flex mt-5">
        <div className="flex items-center">
          <div>
            <p className="ml-10 text-lg font-medium">
              Select a job in your local area and start making extra money! It’s as easy as that.
              <br/><br/>
              Our mission at PrintLink3D is to connect customers with local 3D printing enthusiasts. Interested?
            </p>
            <div className="flex justify-center">
              <button className="mt-5 bg-custom-purple hover:bg-custom-purple-hover text-white font-bold py-5 px-8 rounded-lg text-4xl">
                Get Started
              </button>
            </div>
          </div>
          <div>
            <img src={printer_photo} alt="3D printer" className="w-full ml-10" />
          </div>
        </div>
      </div>
    </div>
  );
}
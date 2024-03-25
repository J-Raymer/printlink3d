import { Link } from "react-router-dom";
import banner_photo from "../images/homepage-main.jpg";
import sub_photo from "../images/homepage-sub-small.jpg";

export default function Home() {
  return (
    <div>
      <div className="bg-center bg-cover bg-no-repeat" style={{backgroundImage: `url(${banner_photo})`, height: '100vh'}}>
        <div style={{backgroundColor: 'rgba(0,0,0,0.5)', top: '0', bottom: '0', left: '0', right: '0', position: 'absolute', zIndex: '1'}}></div>
        <div className="flex flex-col h-full items-center justify-center gap-4 relative" style={{zIndex: '2'}}>
          <h2 className="text-white text-8xl font-bold mb-6">3D Printing Made Local</h2>
          <div>
            <a className="p-4 py-3 bg-brand-blue rounded text-white mr-3 text-xl font-bold inline-block w-[280px] text-center" href="#iwantprint">I have something to print</a>
            <a className="p-4 py-3 bg-brand-blue rounded text-white text-xl font-bold inline-block w-[280px] text-center" href="#ihaveprinter">I have a 3D printer</a>
          </div>
        </div>
      </div>
      <div className="container m-auto">
        <div id="iwantprint" className="flex flex-col items-center justify-center py-[100px]">
          <h2 className="font-bold text-5xl pb-8">Getting Your Model Printed</h2>
          <div className="flex flex-row gap-12 w-full py-8">

            <div className="flex flex-col items-center p-4 pb-8 px-12 rounded w-[25%] text-xl text-center" style={{border: '1px solid #ccc'}}>
              <div class="flex items-center justify-center w-24 h-24 step-circle rounded-full">
                <span class="text-5xl font-bold">1</span>
              </div>
              <h2 className="text-2xl mb-4">Upload a 3D Model</h2>
              <p>We accept STL files or a link to <a href="https://www.thingiverse.com/" className="fg-brand-blue">thingiverse</a></p>
            </div>

            <div className="flex flex-col items-center p-4 pb-8 px-12 rounded w-[25%] text-xl text-center" style={{border: '1px solid #ccc'}}>
              <div class="flex items-center justify-center w-24 h-24 step-circle rounded-full">
                <span class="text-5xl font-bold">2</span>
              </div>
              <h2 className="text-2xl mb-4 mt-3">Set Your Preferences</h2>
              <p>Customize your print by specifying material, color, and infill</p>
            </div>

            <div className="flex flex-col items-center p-4 pb-8 px-12 rounded w-[25%] text-xl text-center" style={{border: '1px solid #ccc'}}>
              <div class="flex items-center justify-center w-24 h-24 step-circle rounded-full">
                <span class="text-5xl font-bold">3</span>
              </div>
              <h2 className="text-2xl mb-4 mt-3">Submit Your Order</h2>
              <p>We’ll connect you with a local 3D printing enthusiast to get your order printed</p>
            </div>

            <div className="flex flex-col items-center p-4 pb-8 px-12 rounded w-[25%] text-xl text-center" style={{border: '1px solid #ccc'}}>
              <div class="flex items-center justify-center w-24 h-24 step-circle rounded-full">
                <span class="text-5xl font-bold">4</span>
              </div>
              <h2 className="text-2xl mb-4 mt-3">Pickup Your Order</h2>
              <p>Connect with your 3D printer to pickup your print</p>
            </div>

          </div>
          <Link to="/create" className="mt-8 bg-brand-purple text-white p-4 px-6 rounded">Get Started</Link>
        </div>
        <div id="ihaveprinter">
          <div className="flex items-center p-12 rounded" style={{backgroundColor: '#F7F7F7'}}>
            <div className="w-[40%] pr-12">
              <h2 className="font-bold text-5xl mb-8">I Have a 3D Printer</h2>
              <p className="text-xl mb-8">Select a job in your local area and start making extra money! It’s as easy as that.
                 <br/><br/>Our mission at PrintLink3d is to connect customers with local 3D printing enthusiasts. Interested? </p>
              <Link to="/browse" className="bg-brand-purple text-white p-4 px-6 rounded">Browse Jobs</Link>
            </div>
            <div className="w-[60%]">
              <img className="rounded" src={sub_photo}/>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black w-full h-[70px] mt-[100px]">
        <div className="container m-auto text-white pt-[25px]">
          <p className="text-xl font-bold">&copy; PrintLink3d 2024</p>
        </div>
      </div>

    </div>
  );
}
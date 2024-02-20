import threeD_printing_home_photo from '../images/3D_printing_home_photo.jpg';

export default function Home() {
  return (
    <div className="relative">
      <img className="absolute w-full object-cover border-b-2 border-black" src={threeD_printing_home_photo}/>
      <h1 className="absolute mt-20 left-1/2 transform -translate-x-1/2 font-extrabold text-8xl text-white whitespace-nowrap">3D Printing Made Local</h1>
      <button className="absolute mt-64 left-1/2 transform -translate-x-1/2 bg-custom-purple hover:bg-custom-purple-hover border text-white font-bold py-5 px-8 rounded-lg text-4xl">Create An Order</button>
    </div>
  );
}
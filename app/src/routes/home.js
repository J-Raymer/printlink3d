import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold p-6 pl-0">Welcome!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/create" className="cta-button"><span className="text-3xl">I need something printed</span></Link>
        <Link to="/browse" className="cta-button"><span className="text-3xl">I can print</span></Link>
      </div>
    </div>
  );
}

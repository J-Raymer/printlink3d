import { Routes, Route, Outlet, useNavigate } from "react-router-dom";

import './app.css';
import Home from './routes/home.js';
import Create from './routes/create.js';
import Browse from './routes/browse.js';


function Layout() {
  const navigate = useNavigate();
  return (
    <div>
      <nav className=" w-full p-2">
        <button className="bg-transparent rounded-lg px-4 py-2" onClick={() => navigate('/')}>
          <h2 className="text-4xl font-bold">PrintLink3D</h2>
        </button>        
      </nav>
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<Home/>} />
        <Route path="create" element={<Create/>} />
        <Route path="browse" element={<Browse/>} />
      </Route>
    </Routes>
  );
}

export default App;
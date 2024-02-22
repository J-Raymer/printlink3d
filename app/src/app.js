import { Routes, Route, Outlet, useNavigate } from "react-router-dom";

import './app.css';
import Home from './routes/home.js';
import Create from './routes/create.js';
import Browse from './routes/browse.js';

function Layout() {
  const navigate = useNavigate();
  return (
    <div>
      <nav className="flex justify-between w-full p-1">
        <button className="bg-transparent rounded-lg px-4 py-2" onClick={() => navigate('/')}>
          <h2 className="text-xl font-bold">PrintLink3D</h2>
        </button>
        <div className="flex space-x-4">
          <button className="bg-transparent rounded-lg px-4 py-2" onClick={() => navigate('/create')}>
            <h2 className="text-xl font-bold">Order</h2>
          </button>
          <button className="bg-transparent rounded-lg px-4 py-2" onClick={() => navigate('/browse')}>
            <h2 className="text-xl font-bold">View Jobs</h2>
          </button>
        </div>     
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
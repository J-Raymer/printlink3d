import { Routes, Route, Outlet } from "react-router-dom";

import './app.css';
import Home from './routes/home.js';
import Create from './routes/create.js';
import Browse from './routes/browse.js';

function Layout() {
  return (
    <div className="container">
      <nav>
        <h2>PrintLink3D</h2>
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

import { Routes, Route, Outlet, useNavigate } from "react-router-dom";
import { useState } from 'react';
import './app.css';
import Home from './routes/home.js';
import Create from './routes/create.js';
import Browse from './routes/browse.js';
import Profile from './routes/profile.js';
import ProfileDropdown from "./components/profileDropdown.js";

function Layout() {
  const navigate = useNavigate();
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [delayHandler, setDelayHandler] = useState(null)

    const handleMouseEnter = () => {
        clearTimeout(delayHandler)
        setDropdownVisible(true)
    }

    const handleMouseLeave = () => {
        setDelayHandler(setTimeout(() => {
          setDropdownVisible(false)
      }, 500))
    }

  return (
    <div>
      <nav className="flex justify-between w-full p-1 bg-transparent px-4 py-2 text-xl font-bold">
        <button onClick={() => navigate('/')}>
          <h2>PrintLink3D</h2>
        </button>
        <div className="flex space-x-4">
          <button onClick={() => navigate('/create')}>
            <h2>Order</h2>
          </button>
          <button onClick={() => navigate('/browse')}>
            <h2>View Jobs</h2>
          </button>
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter()}
            onMouseLeave={() => handleMouseLeave()}
          >
            <button>
              <h2>Profile Name</h2>
            </button>
            {isDropdownVisible && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                style={{ zIndex: 1 }}
              >
                <ProfileDropdown />
              </div>
            )}
          </div>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="create" element={<Create />} />
        <Route path="browse" element={<Browse />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App;
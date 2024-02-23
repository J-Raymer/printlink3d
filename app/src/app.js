import { Routes, Route, Outlet, useNavigate } from "react-router-dom";
import { useState } from 'react';
import './app.css';
import Home from './routes/home.js';
import Create from './routes/create.js';
import Browse from './routes/browse.js';
import profileIcon from './images/profile_icon.png';
import settingsIcon from './images/settings_icon.png';
import ordersIcon from './images/orders_icon.png';

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
                onMouseEnter={() => handleMouseEnter()}
                onMouseLeave={() => handleMouseLeave()}
              >
                <div className="p-3 flex items-center" role="menu">
                  <img src={profileIcon} className="w-10 h-10" alt="profile icon" />
                  <button onClick={() => navigate('/profile')} className="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-100" role="menuitem">Profile</button>
                </div>
                <div className="p-3 flex items-center" role="menu">
                  <img src={ordersIcon} className="w-10 h-10" alt="orders icon" />
                  <button onClick={() => navigate('/orders')} className="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-100" role="menuitem">Orders</button>
                </div>
                <div className="p-3 flex items-center" role="menu">
                  <img src={settingsIcon} className="w-10 h-10" alt="settings icon" />
                  <button onClick={() => navigate('/settings')} className="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-100" role="menuitem">Settings</button>
                </div>
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
      </Route>
    </Routes>
  );
}

export default App;
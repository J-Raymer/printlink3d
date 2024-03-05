import { Routes, Link, Route, Outlet } from "react-router-dom";
import { useState } from 'react';
import './app.css';
import Home from './routes/home.js';
import Create from './routes/create.js';
import Browse from './routes/browse.js';
import Profile from './routes/profile.js';
import ProfileDropdown from "./components/profileDropdown.js";

function Layout() {
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
    <>
      <nav className="flex justify-between items-center w-full px-4 py-3">
        <Link to="/">
          <h2 className="text-4xl">
            <span className="fg-brand-blue">Print</span><span className="fg-brand-purple">Link3D</span>
          </h2>
        </Link>
        <div className="flex space-x-4">
          <Link to="/create"><h2>Order</h2></Link>
          <Link to="/browse"><h2>View Jobs</h2></Link>
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
    </>
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
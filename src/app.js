import { Routes, Link, Route, Outlet } from "react-router-dom";
import { useState } from 'react';
import './app.css';
import Home from './routes/home.js';
import Create from './routes/create.js';
import Browse from './routes/browse.js';
import Profile from './routes/profile.js';
import Orders from "./routes/orders.js";
import OrderPage from "./routes/orderPage.js";
import ProfileDropdown from "./components/profileDropdown.js";
import Register from "./routes/register.js";
import Login from "./routes/login.js";
import { AuthProvider, useAuth } from "./contexts/authContext/index.jsx";

function Layout() {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [delayHandler, setDelayHandler] = useState(null);
  const auth = useAuth();

    const handleMouseEnter = () => {
        //clearTimeout(delayHandler)
        setDropdownVisible(true)
    }

    const handleMouseLeave = () => {
      //setDelayHandler(setTimeout(() => {
          setDropdownVisible(false)
      //}, 100))
    }  
    /* 
  auth = {
    currUser: {
    displayName: String, 
    email: String,
    photoURL: string
  },
    loading: bool,
    userLoggedIn: bool
  }
  */

  return (
    <>
      <nav className="flex justify-between items-center w-full px-4 py-3">
        <Link to="/">
          <h2 className="text-4xl">
            <span className="fg-brand-blue">Print</span><span className="fg-brand-purple">Link3D</span>
          </h2>
        </Link>
        <div className="flex space-x-4">
          <Link to="/create" className="bg-brand-blue text-white p-2 px-4 rounded"><h2>Order</h2></Link>
          <Link to="/browse" className="bg-brand-purple text-white p-2 px-4 rounded"><h2>View Jobs</h2></Link>
          { auth && auth.userLoggedIn ? (
            <div
              className="mt-2"
              onMouseEnter={() => handleMouseEnter()}
              onMouseLeave={() => handleMouseLeave()}
            >
              <button>
                {auth && auth.userLoggedIn && auth.currUser.displayName ? (
                  <h2>{auth.currUser.displayName}</h2>
                ) : (
                  <h2>Profile Name</h2>
                )}
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
          ) : (
            <Link to="/login" className="p-2"><h2>Login</h2></Link>
          )}

        </div>
      </nav>
      <Outlet />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="create" element={<Create />} />
          <Route path="browse" element={<Browse />} />
          <Route path="profile" element={<Profile />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:Id" element={<OrderPage />} />
          <Route path="jobs" element={<Orders isPrinter={true}/>} />
          <Route path="jobs/:Id" element={<OrderPage isPrinter={true}/>} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;

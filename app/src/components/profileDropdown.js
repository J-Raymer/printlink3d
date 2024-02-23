import { useNavigate } from "react-router-dom";
import profileIcon from '../images/profile_icon.png';
import settingsIcon from '../images/settings_icon.png';
import ordersIcon from '../images/orders_icon.png';

function ProfileDropdown() {
  const navigate = useNavigate();

  return (
    <>
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
    </>
  )
}

export default ProfileDropdown;
import { useNavigate } from "react-router-dom";
import profileIcon from "../images/profile_icon.png";
import settingsIcon from "../images/settings_icon.png";
import ordersIcon from "../images/orders_icon.png";

function ProfileDropdown() {
  const navigate = useNavigate();
  const items = [
    {
      icon: profileIcon,
      text: "Profile",
      route: "/profile",
    },
    {
      icon: ordersIcon,
      text: "Orders",
      route: "/orders",
    },
    {
      icon: settingsIcon,
      text: "Settings",
      route: "/settings",
    },
  ];

  const renderItems = () => {
    return items.map((item, index) => (
      <div
        key={index}
        className="p-3 flex items-center hover:bg-gray-200 rounded-lg"
      >
        <img src={item.icon} className="w-10 h-10" alt={`${item.text} icon`} />
        <button
          onClick={() => navigate(item.route)}
          className="block px-4 py-2 text-lg text-gray-700"
        >
          {item.text}
        </button>
      </div>
    ));
  };

  return <>{renderItems()}</>;
}

export default ProfileDropdown;

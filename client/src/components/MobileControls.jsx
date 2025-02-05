import React from "react";
import { NavLink } from "react-router-dom"; // Use NavLink for active link styling
import { Home, Compass, User } from "lucide-react";

const MobileControls = () => {
  return (
<div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 flex justify-between bg-[var(--bg)] 
    pl-4 pr-4 pt-2 rounded-2xl shadow-lg w-[100%] md:hidden">
    

      {/* Home Button */}
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center ${
            isActive ? "text-blue-700  " : "text-[var(--textColor)]"
          } hover:text-blue-700   transition`
        }
      >
        <Home className="h-6 w-6" />
        <span className="text-xs mt-1">Home</span>
      </NavLink>

      {/* Explore Button */}
      <NavLink
        to="/discover"
        className={({ isActive }) =>
          `flex flex-col items-center ${
            isActive ? "text-blue-700  " : "text-[var(--textColor)]"
          } hover:text-blue-700   transition`
        }
      >
        <Compass className="h-6 w-6" />
        <span className="text-xs mt-1">Explore</span>
      </NavLink>

      {/* Profile Button */}
      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `flex flex-col items-center ${
            isActive ? "text-blue-700  " : "text-[var(--textColor)]"
          } hover:text-blue-700   transition`
        }
      >
        <User className="h-6 w-6" />
        <span className="text-xs mt-1">Profile</span>
      </NavLink>
    </div>
  );
};

export default MobileControls;

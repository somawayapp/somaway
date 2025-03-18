import React from "react";
import { NavLink } from "react-router-dom"; // Use NavLink for active link styling
import { Home, Compass, User, Search, Settings } from "lucide-react";

const MobileControls = () => {
  return (
<div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 flex justify-between bg-[var(--bg)] 
    pl-4 pr-4 pt-3 pb-3 shadow-lg w-[100%] md:hidden">
    

      {/* Home Button */}
      <NavLink
        to="/home"
        className={({ isActive }) =>
          `flex flex-col items-center ${
            isActive ? "text-[#0053bf]   " : "text-[var(--softTextColor2)]"
          } hover:text-[#0062e3]    transition`
        }
      >
        <Home className="h-6 w-6" />
      </NavLink>

      {/* Explore Button */}
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center ${
            isActive ? "text-[#0053bf]   " : "text-[var(--softTextColor2)]"
          } hover:text-[#0053bf]    transition`
        }
      >
        <Compass className="h-6 w-6" />
      </NavLink>
      {/* Search Button */}
      <NavLink
        to="/discover"
        className={({ isActive }) =>
          `flex flex-col items-center ${
            isActive ? "text-[#0053bf]   " : "text-[var(--softTextColor2)]"
          } hover:text-[#0053bf]    transition`
        }
      >
        <Search className="h-6 w-6" />
      </NavLink>

      {/* Profile Button */}
      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `flex flex-col items-center ${
            isActive ? "text-[#0053bf]   " : "text-[var(--softTextColor2)]"
          } hover:text-[#0053bf]    transition`
        }
      >
        <User className="h-6 w-6" />
      </NavLink>
    </div>
  );
};

export default MobileControls;

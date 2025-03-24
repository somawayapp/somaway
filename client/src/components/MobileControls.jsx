import React from "react";
import { NavLink } from "react-router-dom"; // Use NavLink for active link styling
import { Home, UserCircle, Search, Settings } from "lucide-react";

const MobileControls = () => {
  return (
<div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 flex justify-between bg-[var(--bg)] 
    pl-4 pr-4 pt-3 pb-3 shadow-lg w-[100%] md:hidden">
    

      {/* Home Button */}
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center ${
            isActive ? "text-[#ff4d52]   " : "text-[var(--softTextColor2)]"
          } hover:text-[#FF5A5F]    transition`
        }
      >
        <Home className="h-5 w-5" />
      </NavLink>

      {/* Explore Button */}
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center ${
            isActive ? "text-[#ff4d52]   " : "text-[var(--softTextColor2)]"
          } hover:text-[#ff4d52]    transition`
        }
      >
        <Compass className="h-5 w-5" />
      </NavLink>
      {/* Search Button */}
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center ${
            isActive ? "text-[#ff4d52]   " : "text-[var(--softTextColor2)]"
          } hover:text-[#ff4d52]    transition`
        }
      >
        <Search className="h-5 w-5" />
      </NavLink>

      {/* Profile Button */}
      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `flex flex-col items-center ${
            isActive ? "text-[#ff4d52]   " : "text-[var(--softTextColor2)]"
          } hover:text-[#ff4d52]    transition`
        }
      >
        <UserCircle className="h-5 w-5" />
      </NavLink>
    </div>
  );
};

export default MobileControls;

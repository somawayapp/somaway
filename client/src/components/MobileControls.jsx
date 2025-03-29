import React from "react";
import { NavLink } from "react-router-dom"; // Use NavLink for active link styling
import { Home, Compass, User, Search, Settings } from "lucide-react";

const MobileControls = () => {
  return (
<div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 flex justify-between bg-[var(--bg)] 
    pl-4 pr-4 pt-3 pb-3 shadow-lg w-[100%] md:hidden">
    

      {/* Home Button */}
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center ${
            isActive ? "text-[#fc3239]   " : "text-[var(--softTextColor2)]"
          } hover:text-[#fc3239]    transition`
        }
      >
        <Home className="h-5 w-5" />
      </NavLink>

      {/* Explore Button */}
      <NavLink
        to="/reviews"
        className={({ isActive }) =>
          `flex flex-col items-center ${
            isActive ? "text-[#fc3239]   " : "text-[var(--softTextColor2)]"
          } hover:text-[#fc3239]    transition`
        }
      >
        <Compass className="h-5 w-5" />
      </NavLink>
      {/* Search Button */}
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center ${
            isActive ? "text-[#fc3239]   " : "text-[var(--softTextColor2)]"
          } hover:text-[#fc3239]    transition`
        }
      >
        <Search className="h-5 w-5" />
      </NavLink>

      {/* Profile Button */}
      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `flex flex-col items-center ${
            isActive ? "text-[#fc3239]   " : "text-[var(--softTextColor2)]"
          } hover:text-[#fc3239]    transition`
        }
      >
        <User className="h-5 w-5" />
      </NavLink>
    </div>
  );
};

export default MobileControls;

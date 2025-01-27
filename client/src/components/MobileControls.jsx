import React from "react";
import { Home, Compass, User } from "lucide-react";

const MobileControls = () => {
  return (
    <div className="fixed bottom-0left-1/2 transform -translate-x-1/2 flex justify-between bg-gray-800 p-4 rounded-2xl shadow-lg w-[90%] max-w-md">
      {/* Home Button */}
      <button className="flex flex-col items-center text-white hover:text-orange-500 transition">
        <Home className="h-6 w-6" />
        <span className="text-sm mt-1">Home</span>
      </button>

      {/* Explore Button */}
      <button className="flex flex-col items-center text-white hover:text-orange-500 transition">
        <Compass className="h-6 w-6" />
        <span className="text-sm mt-1">Explore</span>
      </button>

      {/* Profile Button */}
      <button className="flex flex-col items-center text-white hover:text-orange-500 transition">
        <User className="h-6 w-6" />
        <span className="text-sm mt-1">Profile</span>
      </button>
    </div>
  );
};

export default MobileControls;

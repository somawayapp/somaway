import React from "react";
import { useRouter } from "next/router";
import { Home, Compass, User } from "lucide-react";
import { Link } from "react-router-dom";

const MobileControls = () => {
  const router = useRouter();
  const { pathname } = router;

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 flex justify-between bg-[var(--bg)] p-4 rounded-2xl shadow-lg w-[100%] max-w-sm">
      {/* Home Button */}
      <Link href="/" passHref>
        <button
          className={`flex flex-col items-center ${
            pathname === "/" ? "text-blue-700" : "text-[var(--textColor)]"
          } hover:text-blue-700 transition`}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </button>
      </Link>

      {/* Explore Button */}
      <Link href="/discover" passHref>
        <button
          className={`flex flex-col items-center ${
            pathname === "/explore" ? "text-blue-700" : "text-[var(--textColor)]"
          } hover:text-blue-700 transition`}
        >
          <Compass className="h-6 w-6" />
          <span className="text-xs mt-1">Explore</span>
        </button>
      </Link>

      {/* Profile Button */}
      <Link href="/settings" passHref>
        <button
          className={`flex flex-col items-center ${
            pathname === "/profile" ? "text-blue-700" : "text-[var(--textColor)]"
          } hover:text-blue-700 transition`}
        >
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </Link>
    </div>
  );
};

export default MobileControls;

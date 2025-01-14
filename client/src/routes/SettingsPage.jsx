import { Link } from "react-router-dom";
import ThemeToggler from "../components/Theme";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

const SettingsPage = () => {
  return (
    <div className="mt-4 px-6 md:px-12 lg:px-24 flex flex-col gap-12">
      {/* BREADCRUMB */}
      <div className="flex gap-2 text-sm text-[var(--textColor)]">
        <Link to="/" className="hover:text-blue-800">
          Home
        </Link>
        <span>•</span>
        <span className="text-[#1da1f2]">Settings</span>
      </div>

      {/* INTRODUCTION */}
      <div className="text-center flex flex-col gap-4">
        <h1 className="text-[#1da1f2] text-3xl md:text-4xl lg:text-5xl font-bold">
          Settings
        </h1>
        

      
      </div>

      {/* TESTIMONIALS */}
      <div>
        <h2 className="text-[var(--textLogo)] text-3xl font-semibold mb-4 text-center">
       Edit your profile        </h2>
        <div className="grid gap-6">
          {["Profile settings"].map((name, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-4 bg-[var(--textColore)] p-6 rounded-lg shadow-lg"
            >
              
              {/* Circular Profile Image */}
              <div className=" item-center overflow-hidden">
              <SignedOut>
          <Link to="/login">
            <button className="py-2 px-4 rounded-3xl bg-[#1DA1F2] text-white">
              Login 👋
            </button>
          </Link>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
              </div>

              {/* Name and Feedback */}
              <h3 className="text-lg font-medium text-[var(--textColor)] text-center">
                {name}
              </h3>
              <p className="text-sm text-[var(--textColor)] text-center italic">
Click on the profile image to edit your profile/ <span className=" text-[#1da1f2]  hover:text-[#0875b9]">  <Link to="/login">  Login</Link>   </span>               </p>
            </div>
          ))}
        </div>
      </div>

      {/* CALL TO ACTION */}
      <div className="mt-6 text-center">
        <h3 className="text-[var(--textLogo)] text-xl font-semibold mb-2">
          Change color theme?
        </h3>
        <p className="text-md text-[var(--textColor)] leading-relaxed">
Click on the toogle button below to the chnage the theme between light mode and dark mode        </p>
        <Link
          className="mt-4 inline-block px-6 mb-[35px] py-2 bg-[#1da1f2]  rounded-full font-medium hover:bg-[#0875b9] transition duration-300"
        >
                   <ThemeToggler />

        </Link>


      </div>

      
    </div>
  );
};

export default SettingsPage;

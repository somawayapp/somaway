import { Link } from "react-router-dom";
import ThemeToggler from "../components/Theme";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";
const SettingsPage = () => {
  return (
    <div className="mb-[80px] ">
    <Navbar/>




    <div
         className="relative bg-[#7a00da] mt-[20px] md:mt-[50px] w-full rounded-md md:rounded-[30px] shadow-md 
           text-[var(--bg)] text-center animate-fadeIn flex flex-col items-center justify-center"
       >
         <div className="h-full p-2  box-border">
           <h1 className="text-3xl md:text-6xl  mt-[20px] md:mt-[70px] font-bold">
             Settings
           </h1>
           <p className="mt-2 text-md md:text-xl">
           Click the profile image to edit your info or logout!
                 </p>
           <p className="mt-2 text-md md:text-xl">
             Profile settings
           </p>

           <div >
       
        <div className="grid gap-6">
          {[""].map((name, i) => (
            <div
              key={i}
              className="flex flex-col items-center  gap-4 p-6  "
            >
              
              {/* Circular Profile Image */}
              <div className=" item-center overflow-hidden">
              <SignedOut>
          <Link to="/login">
            <button     className="bg-[var(--bg)] text-[var(--textColor)] py-4 text-extrabold text-xl md:text-2xl 
               px-8 rounded-[40px] cursor-pointer hover:bg-[var(--textColor)] hover:text-[var(--bg)] ">
              Login 
            </button>
          </Link>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
              </div>

              <h3 className="text-lg font-medium text-[var(--bg)] text-center">
                {name}
              </h3>
              <p className="text-sm text-[var(--bg)] text-center italic">
             Click on the profile image to edit your profile/ <span className=" text-[var(--textColor)]  hover:text-[#01274f]   ]">  
              <Link to="/login">  Login</Link>   </span>               </p>
            </div>
          ))}
        </div>
      </div>
          
         </div>
         <div className="mt-6 text-center">
        <h3 className="text-[var(--bg)] text-xl font-semibold mb-2">
          Change color theme?
        </h3>
        <p className="text-md text-[var(--bg)] leading-relaxed">
Click on the toogle button below to the chnage the theme between light mode and dark mode        </p>
        <Link
          className="mt-4 inline-block  mb-[35px]  font-medium  transition duration-300"
        >
                   <ThemeToggler />

        </Link>


      </div>

       </div>
   


        </div>

  );
};

export default SettingsPage;

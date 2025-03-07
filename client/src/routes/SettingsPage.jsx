import { Link } from "react-router-dom";
import ThemeToggler from "../components/Theme";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect } from "react";
const SettingsPage = () => {

  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top when this component mounts
  }, []);
  
  return (
    <div className="mb-[80px] ">
    <Navbar/>




    <div
         className="relative  w-full  text-white  text-center animate-fadeIn flex flex-col items-center justify-center"
       >
       

       
       

  


         <div className="bg-[#6402db] p-3 md:p-9  mx-auto w-full  max-w-[1200px] mb-[70px]  mt-[20px] md:mt-[70px]  shadow-md text-center">
        <h3 className="text-white  mt-[20px] md:mt-[70px]  text-xl font-semibold mb-2">
          Change color theme?
        </h3>
        <p className="text-md text-white  leading-relaxed">
Click on the toogle button below to the chnage the theme between light mode and dark mode        </p>
        <Link
          className="mt-4 inline-block  mb-[35px]  font-medium  transition duration-300"
        >
                   <ThemeToggler />

        </Link>


      </div>

       </div>
   

       <Footer/>

        </div>

  );
};

export default SettingsPage;
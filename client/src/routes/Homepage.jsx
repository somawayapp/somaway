import { useEffect, useState, useRef } from "react";
import FeaturedPosts from "../components/FeaturedPosts";
import PostList from "../components/PostList";
import { Link } from "react-router-dom";
import Search from "../components/Search2";
import Maincategories from "../components/MainCategories";
import SideMenu from "../components/SideMenu";
import ThemeToggler from "../components/Theme";
import Sidebar from "../components/Sidebar2";
import { ThemeProvider } from "../../themecontext";
import Navbar from "../components/Navbar";
import CategoriesScroll from "../components/CategoriesScroll";
import Hero from "../components/Hero";
import LatestPosts from "../components/LatestPosts";
import PopularPosts from "../components/PopularPosts";
import TrendingPosts from "../components/TrendingPosts";
import StoryLine from "../components/StoryLine";
import Footer from "../components/Footer";
import MobileControls from "../components/MobileControls";

const Homepage = () => {
 

  return (
      <div>
            <Navbar/>

    <div className="mb-9  flex flex-col gap-0">

         

      {/* Floating Section 
      
      <div
  className={` flex items-center hidden sm:block  mx-auto justify-between px-5 py-3 transition-opacity 
    duration-300 ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"} sm:opacity-100 sm:pointer-events-auto  `}
 
>


        <Link to="/" className="flex items-center mt-[10px] gap-1 text-lg font-bold md:text-2xl">
        <img src="/x.png"  className="w-50 h-20 lg:w-50 lg:h-20" />

<span className="text-[var(--textLogo)] text-[30px] lg:text-[90px]"></span>

</Link>  

      

 
      </div>
      */}

   {/*

      <div  style={{ zIndex: 100004 }} className="mb-[45px] md:mb-[30px] mt-[15px] md:mt-[20px] sticky top-0.5 md:top-2 ">
  <Maincategories />
</div>
     */}
     
        <Hero />

   <CategoriesScroll />


   <div
         className="bg-[var(--bodyBg)] p-4 md:p-9 mt-[10px] mx-3 md:mx-9 rounded-lg md:rounded-[30px]
           text-white text-center animate-fadeIn flex flex-col items-center justify-center"
       >
         <div className="h-full p-2 max-w-full md:max-w-[700px] mx-auto box-border">
         <h1 className="text-2xl md:text-5xl mt-[15px] md:mt-[50px] font-bold">
         Set your goal and start your self-growth journey
                   </h1>
    <div className="flex gap-2 items-center justify-center md:gap-4 flex-row">
    <button
          className="mt-5 mb-5 border border-[var(--softBg4)] bg-[var(--bd2)] text-[var(--bg)] py-3 font-semibold text-xs md:text-sm 
            px-9 rounded-[10px] cursor-pointer hover:bg-[#0053bf]   "
        >   <img
        src="/fiction.webp"
        className="w-4 h-4 md:w-8 md:h-8 object-cover rounded-full"
          />
          Summaries
        </button>  <button
          className="mt-5 mb-5 border border-[var(--softBg4)] bg-[var(--bd)] text-[var(--textColor)] py-3 font-semibold text-xs md:text-sm 
            px-9 rounded-[10px] cursor-pointer hover:bg-[#0053bf]   "
        >
                 <img
            src="/self-growth.webp"
            className="w-4 h-4 md:w-8 md:h-8 object-cover rounded-full"
              />
          Log In 
        </button>  
         <button
          className="mt-5 border border-[var(--softBg4)] hidden md:block mb-5 bg-[var(--bd2)] text-[var(--bg)] py-3 font-semibold text-xs md:text-sm 
            px-9 rounded-[10px] cursor-pointer hover:bg-[#0053bf]   "
        >        <img
        src="/negotiation.webp"
        className="w-4 h-4 md:w-8 md:h-8 object-cover rounded-full"
          />
          Get started 
        </button>  

    </div>
                 
         
         </div >

         <div className="flex bg-[var(--bd2)] flex-col max-w-full md:max-w-[900px] m gap-2 md:gap-4 rounded-lg md:rounded-[20px] p-2 md:p-6 md:flex-row">
  <img
    src="/heropic.jpg"
    className="w-[200px] rounded-lg md:rounded-[20px] md:w-2/5 mx-auto md:mx-0"
  />
  <div className="md:w-3/5 items-start justify-start md:text-left">
    <p className="text-xs mt-5 md:mt-9  text-[var(--softTextColor)] md:text-md">ABOUT US</p>
    <p className="text-md mt-1 md:mt-2 md:text-2xl font-semibold">
      Still wondering what is Somaway app?
    </p>
    <p className="text-sm mt-1 md:mt-2 md:text-lg">
      Somaway is a global EdTech startup with Kenyan roots. Somaway app offers
      15-minute bite-sized non-fiction book summaries catered to your everyday
      needs. We are mission-driven and passionate about self-improvement.
    </p>
  </div>
</div>

       
       </div>



      <StoryLine />

      <Footer />


    
    </div>
    </div>

  );
};

export default Homepage;

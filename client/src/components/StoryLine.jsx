import React, { useEffect, useRef, useState } from "react";
import { FaStar } from 'react-icons/fa';
import { Link } from "react-router-dom";


const StoryLine = () => {


  return (
<div className="mt-[20px] md:mt-[40px] ">


<div>
  {/* Background Section */}
  <div
    className="sticky top-0  bg-cover bg-center h-screen w-full flex flex-col 
      items-center justify-center text-white text-center overflow-y-auto"
    style={{ backgroundImage: "url('/bgbook.webp')" }}
  >
  
  </div>


<div className="items-center justify-center text-white mt-[-500px] md:mt-[-650px] mb-[250px] md:mb-[550px] text-center ">

<div className="h-full p-1 box-border">
      <h1 className="text-3xl md:text-6xl  font-bold">
        Enjoy summarized nonfiction
      </h1>
      <h1 className="text-3xl md:text-6xl font-bold">bestsellers</h1>
      <p className="mt-2 text-md md:text-xl">
        Grasp the book’s key ideas in less than 5 minutes
      </p>
      <button className="mt-9 bg-white text-black py-3 text-bold px-6 rounded-lg cursor-pointer hover:bg-gray-200">
        Get Started
      </button>
    </div>
</div>

  {/* Scrolling Content */}
  <div className="p-2 md:p-[30px] md:mb-[20px] mt-[120px]">
    <div
      className="relative bg-white w-full rounded-3xl md:rounded-[30px] shadow-md 
        text-black text-center animate-fadeIn flex flex-col items-center justify-center"
    >
      <div className="h-full p-2  box-border">
        <h1 className="text-3xl md:text-6xl mt-[20px] md:mt-[70px] font-bold">
          Get new knowledge easily
        </h1>
        <p className="mt-2 text-md md:text-xl">
          Let’s check how many titles you can finish in a month with  Somaway! Tell us how
        </p>
        <p className="mt-2 text-md md:text-xl">
          much time you’d like to spend on reading:
        </p>
        <button
          className="mt-9 bg-black text-white py-4 text-extrabold text-2xl md:text-5xl 
            px-8 rounded-[40px] cursor-pointer hover:bg-[#FF5A5F]   "
        >
          30 titles/month
        </button>
      </div>
      <img
        src="/pic3.svg"
        className="max-w-full h-auto mx-auto mt-8"
      />
    </div>
  </div>
</div>





    <div className="flex flex-col px-3 md:px-9 items-center justify-center">
      <div className="mt-0 mb:mt-[45px]">
        <div className="flex flex-col items-center justify-center mt-[60px] md:mt-[120px] mb-[40px] pt-9 pb-9 rounded-2xl gap-5">
          <img
            src="/group-16087.svg"
            className="w-50 md:w-100 h-20 md:h-40 object-cover"
          />
    
          <div className="max-w-[900px] text-center mx-auto">
            <h1 className="my-8 lg:text-6xl text-2xl mb-2 mt-4 lg:mb-5 lg:mt-8 font-bold text-[var(--textColor)]">
              Join 40+ million learners around the world
            </h1>
            <p className="text-[var(--textColor)] pl-9 pr-5  text-md md:text-xl mb-5 md:mb-7">
              60K 
              <span>
                <Link
                  className="rounded-2xl py-1 ml-1 mr-1  px-3 text-white bg-orange-500 inline-flex items-center gap-2"
                >
                  5 <FaStar className="text-white" />
                </Link>
              </span>
              reviews on App Store and Google Play
            </p>
    
            <div className="flex justify-center gap-4 mt-6">
              <img
                src="/google-play.svg"
                className="h-5 border border-2 border-[var(--textColore)]  rounded-lg h-auto object-contain"
              />
              <img
                src="/app-store.svg"
                className="h-5 h-auto border border-2 border-[var(--textColore)]  rounded-lg object-contain"
              />
            </div>
          </div>
    
          <div className="grid grid-cols-1 mx-auto max-w-[1200px] md:grid-cols-3 gap-6 mt-8 w-full px-4">
  {[
    {
      text: "Everything you need to be motivated, to learn & to self improve is all here. I actually do believe that this is the best book summuary app. This works very good for me. Thank you.",
    },
    {
      text: "The selections are on point and the summaries are excellent! I read them at all times 🐶 and have in turn, ordered a few selections! REALLY loving the app, its layout, daily selections and features!",
    },
    {
      text: "The app is so easy to use. I use it after school and it's great. I love the fact that the chapters are short, so you can finish them quickly. Very knowledgeable.",
    },
  ].map((review, index) => (
    <div
      key={index}
      className="bg-[var(--bd)] shadow-2xl rounded-3xl p-4 md:px-8  flex flex-col items-center text-center"
    >
      <div className="flex gap-1 mb-2">
        {Array(5)
          .fill(0)
          .map((_, starIndex) => (
            <FaStar
              key={starIndex}
              className="text-yellow-500 w-[25px] text-orange-500"
            />
          ))}
      </div>
      <p className="text-sm md:text-lg  text-[var(--textColor)]">{`"${review.text}"`}</p>
    </div>
  ))}
</div>

        </div>
      </div>
    </div>


    
 


    <div
      className="relative bg-[#7a00da] w-full  shadow-md 
        text-white text-center animate-fadeIn flex flex-col items-center justify-center"
    >
      <div className="h-full p-2  box-border">
        <h1 className="text-3xl md:text-6xl mt-[20px] md:mt-[70px] font-bold">
          Go premium now 
        </h1>
        <p className="mt-2 text-md md:text-xl">
        Experience unlimited acces to our exclusive book summaries 
              </p>
        <p className="mt-2 text-md md:text-xl">
          on a premium model for only $4.99 per month :
        </p>
        <Link to="/premium">
        <button
        className="mt-9 bg-black text-white py-4 text-extrabold text-2xl md:text-5xl 
        px-8 rounded-[40px] cursor-pointer hover:text-black hover:bg-white"
>

        $4.99 US/month
      </button>
        
        </Link>
      
      </div>
      <img
        src="/illustration.svg"
        className="max-w-full h-auto mx-auto mt-8"
      />
    </div>

    <div className="flex flex-col px-3 md:px-9 items-center justify-center">
  <div>
    <div className="flex flex-col items-center justify-center mb-[40px] pt-9 pb-9 rounded-2xl gap-5">
      <div className="grid grid-cols-1 mx-auto md:grid-cols-3 gap-6 mt-8 w-full px-4">
        {[
          {
            text: "Who we are –  Somaway is a non-fiction book summary app",
            icon: "negotiation.webp",
          },
          {
            text: "Mission - Empower every curious mind with the tools to learn, grow, and create.",
            icon: "business-and-career.webp",
          },
          {
            text: "Vission - To become the world’s leading platform for self-education and growth.",
            icon: "self-growth.webp",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-[var(--bd)] shadow-2xl rounded-2xl md:rounded-[20px] p-4 md:px-8 flex flex-col items-start text-left relative"
          >
            {/* Icon */}
            <img
              src={item.icon}
              className="absolute top-4 left-4 w-12 h-18 md:w-20 md;h-30"
            />
            {/* Text */}
            <p className="text-lg md:text-2xl font-bold text-[var(--textColor)] mt-[70px] md:mt-[150px] ">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>

    <div className="flex justify-between  mb-15  md:mb-[40px] pt-5 p-3  md:p-9 overflow-x-hidden   bg-[#7a00da] 
        items-center gap-5 flex-col md:flex-row">
      <div>
      <h1 className="my-8 text-center lg:text-5xl text-2xl ml-2 pl-2 md:pl-0 mb-2 mt-4 lg:mb-5 lg:mt-8 text-white font-bold">
      Get smarter in just 5 minutes</h1>
      <p className="text-white pl-2 md:pl-0 text-center md:text-left pr-4 ml-2 text-md mb-5 md:mb-7 md:text-xl">Grasp the book’s key ideas in less than 5 minutes

</p>
<div className="flex justify-center md:justify-start">
<Link
            to="/login"
            className="w-full items-center ml-4 md:ml-2 mr-4 text-center  text-md md:text-xl sm:w-auto px-4 md:px-6  py-3 md:py-3 bg-white 
            text-black font-semibold  rounded-md hover:text-white hover:bg-black"
          >
            Get Started    
          </Link>
</div>
    
    </div>

     <img
            src="/group.svg"
            className="w-100 md:w-180  h-40 md:h-80  md:mr-[40px] mr-0 object-cover "
          />   
          
          </div>




</div>


    
  );
};

export default StoryLine;

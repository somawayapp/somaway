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
    style={{ backgroundImage: "url('/house.jpg')" }}
  >
  
  </div>


<div className="items-center justify-center text-white mt-[-500px] md:mt-[-650px] mb-[250px] md:mb-[550px] text-center ">

<div className="h-full p-1 box-border">
      <h1 className="text-3xl md:text-6xl  font-bold">
        Find your dream home
      </h1>
      <h1 className="text-3xl md:text-6xl font-bold">here!</h1>
      <p className="mt-2 text-md md:text-xl">
     In less than 5 minutes. Hodii, where dreams come true. 
          </p>
          import { Link } from 'react-router-dom';

<Link to="/">
  <button className="mt-9 bg-white text-black py-3 font-bold px-6 rounded-lg cursor-pointer hover:bg-gray-200">
    Dream now
  </button>
</Link>

    </div>
</div>

  {/* Scrolling Content */}
  <div className="p-2 md:p-[30px] md:mb-[20px] mt-[120px]">
    <div
      className="relative bg-white w-full rounded-3xl md:rounded-[30px] shadow-md 
        text-black text-center animate-fadeIn flex flex-col items-center justify-center"
    >
      <div className="h-full p-2  box-border">
        <h1 className="text-2xl md:text-6xl mt-[40px] md:mt-[70px] font-bold">
        We make house hunting easier        </h1>
        <p className="mt-2 text-sm md:text-xl">
        Browse a collection of more than 20 000 listings and  
        </p>
        <p className="mt-2 text-sm md:text-xl">
        find your dream home in less than 5 minutes 
                </p>
        <button
          className="mt-9 bg-black text-white py-4 text-extrabold text-2xl md:text-5xl 
            px-8 rounded-[40px] cursor-pointer hover:bg-[#FF5A5F]   "
        >
         for free!
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
         
    
          <div className="max-w-[900px] text-center mx-auto">
            <h1 className="my-8 lg:text-6xl text-2xl mb-2 mt-4 lg:mb-5 lg:mt-8 font-bold text-[var(--textColor)]">
              Join 4+ million dreamers around the nation
            </h1>
            <p className="text-[var(--textColor)] pl-9 pr-5  text-md md:text-xl mb-5 md:mb-7">
              20K 
              <span>
                <Link
                  className="rounded-2xl py-1 ml-1 mr-1  px-3 text-white bg-orange-500 inline-flex items-center gap-2"
                >
                  5 <FaStar className="text-white" />
                </Link>
              </span>
              rated listings available all for free
            </p>
    
          </div>
    
          <div className="grid grid-cols-1 mx-auto max-w-[1200px] md:grid-cols-3 gap-6 mt-8 w-full px-4">
  {[
  [
    { 
      text: "I was tired of walking from estate to estate just to find a decent rental. Hodii changed everything. I found my new apartment within two days, all from my phone. This platform is a lifesaver. — Diana K., Nairobi",
    },
    {
      text: "Buying my first home felt overwhelming—until I discovered Somaway. The filters were super helpful, the listings were legit, and I could compare prices without pressure. I ended up finding a house that checked every box. I still can’t believe how smooth it was. — Michael O., Nairobi",
    },
    {
      text: "As an agent, Somaway has become my go-to tool. I can list properties, get quality leads, and manage viewings all in one place. It’s cut down my workload and helped me close deals faster. Honestly, it’s a game-changer for this industry. — Sarah M., Property Agent, Mombasa",
    },
  ]
  
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


    
 


    

    

 




</div>


    
  );
};

export default StoryLine;

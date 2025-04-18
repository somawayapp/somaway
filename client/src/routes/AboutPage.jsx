import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaStar } from 'react-icons/fa';
import PlanCard from "../components/PlanCard";
import { useEffect } from "react";

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top when this component mounts
  }, []);

  return (
    <div>
<Navbar/>     

<div>


      <div
         className="relative bg-[#7a00da] px-4 md:px-[80px] mt-[20px] md:mt-[50px] w-full shadow-md 
           text-white text-center animate-fadeIn flex flex-col items-center justify-center"
       >
         <div className="h-full p-2  max-w-[900px] mx-auto box-border">
         <h1 className="text-3xl md:text-6xl mt-[20px] md:mt-[70px] font-bold">
            Hodi
                   </h1>
           <p className="mt-2 text-md md:text-xl">
               Making your dream home come true everyday               </p>
        
        
         </div>
         <img
           src="/house.jpg"
           className="h-[100px] md:h-[400px] px-9 md:px-[80px] mx-auto "
         />
       </div>

   <div >
  
   
   <div className="flex   px-4 md:px-[80px] flex-col items-center justify-center">
  <div>
    <div className="flex flex-col items-center justify-center mb-[40px] pt-9 pb-9 rounded-2xl gap-5">
      <div className="grid grid-cols-1 mx-auto md:grid-cols-3 gap-6 mt-8 w-full px-4">
        {[
          {
            text: "2024 –  Somaway founded by Lexanda Mbelenzi",
            icon: "rocket.svg",
          },
          {
            text: " Somaway has grown from a 1-person startup into a team of 5+ people in 3 months",
            icon: "smile.svg",
          },
          {
            text: "Now,  Somaway has offices in London, Nairobi, and San Francisco.",
            icon: "pin.svg",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-[var(--bd)] shadow-2xl rounded-2xl md:rounded-[20px] p-4 md:px-8 flex flex-col items-start text-left relative"
          >
            {/* Icon */}
            <img
              src={item.icon}
              className="absolute top-4 left-4 w-12 h-12 md:w-20 md;h-20"
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

   
   
   
    
   
<div className=" bg-[#6402db]   bg-cover bg-no-repeat" style={{ backgroundImage: "url('/bg.svg')" }}>


  <div className="flex flex-col pl-3 pr-3 pt-12 md:pt-0  md:pl-[100px] lg:pl-[200px] md:flex-row items-center justify-between  z-10 text-black">
    <div className="flex-1  text-center  md:text-left">
    <h3 className="text-3xl md:text-5xl font-bold mb-4">How did the idea of Hodii come?</h3>
      <p className="text-sm md:text-lg max-w-md mb-6">
      
      It was on my first day in campus. Unfortunately the school did not have any remaining hostel space so i had to find myself
          a rental outside the school on the same day. It was probably the hottest day of the year and the dustiest day of the month. 
         I spent my entire day knocking doors until evening came and i had not found a place yet. Every door that flang open was 
         either an arrogant caretaker or "no vacants here". I tarmaced for four days but couldn't find the perfect and afordable place. 

        The following day, when asking a stranger for directions, she suggested that maybe i should try searching online. With a sigh of relief i 
        found a nice shaded place and started doom scrolling and cold calling for hours just to end up disapointed. Most of the houses listed online
        were years old on the plartforms which made that they were no longer vacant, and some even had fake pictures and prices.
        
         Later on in the  day while taking my last lap around, i had this idea ringing in my mind, "what if i created this plartform, a place that
         would solve all this problems, a place where i could find a house in less than 30 seconds and move in?" But it was just an idea. 
         I had no choice but to keep tracking and fourtunately i found a fair place in the week that followed. I never thought that i would have
        to move out and go house hunting again, but trust me, i can't find a house online four years later and i am not hawking for a whole week.
        Ibelieve that there are other people out there who share the same pain point and i'd better make this idea come true.

      </p>
      <img 
  src="/love.svg" 
  className="w-8 h-8 mb-6 mx-auto md:mx-0 md:ml-0" 
/>

       <p className="font-semibold text-md">Lexanda Mbelenzi</p>
      <p className="text-sm text-opacity-80"> Somaway CEO and founder</p>
    </div>

    {/* Adjust vertical alignment with self-start or self-end */}
    <div className=" self-end  z-10">
      <img src="/ceo.png" className=" h-[500px] top-0 md:top-[150px] mt-0 md:mt-[300px] object-cover" />
    </div>
  </div>


</div>

<div className= "bg-[#6402db]  hidden md:block  h-[23vh]">

</div>

   
   

<div className="flex flex-col  px-4 md:px-[80px] items-center justify-center">
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
   
<div className="flex items-center justify-center text-[var(--textColor)] mx-auto">
  <div className="text-center">
    <p className="mt-2 text-sm md:text-lg">
      Contact us makesomaway@gmail.com or call +254 703 394794
    </p>
    <button
    to="/"
      className="mt-9 bg-[var(--textColor)] text-[var(--bg)] py-4 text-extrabold text-xl md:text-3xl 
        px-8 rounded-[40px] cursor-pointer hover:bg-white hover:text-black"
    >
      Discover
    </button>
  </div>
</div>

</div>
    
         
   </div>
   <Footer/>     

    </div>
  );
}


export default AboutPage;


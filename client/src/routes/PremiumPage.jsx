import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaStar } from 'react-icons/fa';
import PlanCard from "../components/PlanCard";
import { useEffect } from "react";

const PremiumPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top when this component mounts
  }, []);

  return (
    <div>
<Navbar/>     



      <div
         className="relative px-3 md:px-9 bg-[#7a00da] mt-[20px] md:mt-[50px] w-full shadow-md 
           text-white text-center animate-fadeIn flex flex-col items-center justify-center"
       >
         <div className="h-full p-2  box-border">
           <h1 className="text-3xl md:text-6xl mt-[20px] md:mt-[70px] font-bold">
             Enjoy it free for now 
           </h1>
           <p className="mt-2 text-md md:text-xl">
           Experience unlimited acces to our exclusive book summaries 
                 </p>
           <p className="mt-2 text-md md:text-xl">
             somaway is free for now. Premium is comming soon!
           </p>
           <button
             className="mt-9 bg-black text-white py-4 text-extrabold text-2xl md:text-5xl 
               px-8 rounded-[40px] cursor-pointer hover:bg-white hover:text-black "
           >
             Free/now
           </button>
         </div>
         <img
           src="/illustration.svg"
           className="h-[100px] mx-auto mt-8"
         />
       </div>
   





   <div className="mt-[40px] md:mt-[80px] ">
   <div>
     {/* Background Section */}

   
   
    

   </div>

   
   
   
   
   
       <div className="flex flex-col items-center justify-center">
         <div className="">
           <div className="flex flex-col items-center justify-center mt-[20px] mb-[40px] pt-9 pb-9 rounded-2xl gap-5">
          
       
             <div className="max-w-[900px] text-center mx-auto">
               <h1 className="my-8 lg:text-6xl text-2xl mb-2 mt-4 lg:mb-5 lg:mt-8 font-bold text-[var(--textColor)]">
                  What our users say            
                             </h1>
           
       
             
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
         className="bg-[var(--bd)] shadow-2xl rounded-2xl p-4 md:px-8  flex flex-col items-center text-center"
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
   <Footer/>     

    </div>
  );
}


export default PremiumPage;

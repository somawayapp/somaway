import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";
import Link from "next/link";



const AboutPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Simulate loading delay (you can replace this with real data fetching)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Adjust time as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
    {loading ? (
      <div className="flex justify-center items-center h-screen">
      </div>
    ) : (
      <div>
<Helmet>
  <title>Shilingi - Your Micro-Contribution & Reward Platform for Community Empowerment</title>

  <meta
    name="description"
    content="Shilingi is a fun and trusted micro-contribution and reward platform. Toss in your little bit to make a big difference, empower communities, and stand a chance to change lives. Built on transparency and teamwork."
  />

  <meta
    name="keywords"
    content="micro-contribution, community empowerment, reward platform, shilingi, crowdfunding, social giving, collective impact, small contributions, big difference, trust, transparency, teamwork, fun contributions, life-changing, community building, digital giving, peer-to-peer giving, grassroots funding, shared prosperity, collective action, social impact, online community, mutual support, participation, financial inclusion, digital rewards, community fund, easy giving, secure contributions, positive change"
  />
</Helmet>

<div
  style={{ zIndex: 100004 }}
  className="md:px-[5%] bg-[var(--bg)] px-4 sticky top-0 justify-between flex py-4 flex-row text-xs"
>
  <div className="gap-2 md:gap-6 flex flex-row">
    <Link href="/">
      <p className="text-[#f2f2f2] hover:text-[#f36dff] transition cursor-pointer">Home</p>
    </Link>
    <Link href="/terms">
      <p className="text-[var(--softTextColori)] hover:text-[#f36dff] transition cursor-pointer">Terms</p>
    </Link>
    <Link href="/about">
      <p className="text-[var(--softTextColori)] hover:text-[#f36dff] transition cursor-pointer">About</p>
    </Link>
  </div>
  <div className="gap-2 md:gap-6 flex flex-row">
    <Link href="/help">
      <p className="text-[var(--softTextColori)] hover:text-[#f36dff] transition cursor-pointer">Participate </p>
    </Link>
    <Link href="/help">
      <p className="text-[var(--softTextColori)] hover:text-[#f36dff] transition cursor-pointer">Help</p>
    </Link>
  </div>
</div>

  
        <Navbar />
    


      <div>
      



    <div className="mb-9  flex flex-col gap-0">

    <div>
<div >

<div className=" bg-[#65026e]   bg-cover bg-no-repeat" style={{ backgroundImage: "url('/bg.svg')" }}>


<div className="flex flex-col pl-3 pr-3 pt-12 md:pt-0  md:pl-[100px] lg:pl-[200px] md:flex-row items-center justify-between  z-10 text-white">
<div className="flex-1  text-center  md:text-left">
<h3 className="text-3xl md:text-5xl font-bold mt-4 mb-4">How did the idea of Shilingi come?</h3>
<p className="text-sm md:text-lg max-w-lg mb-6">
One day i walked out of the supermarket with three shillings in my hand, hardly any money at all these days. I remember when that
 could buy so much – bread, milk, sweets, and even get some change back. Now, it just feels… small.

I tossed the coins in the air on my way home, and three of them slipped away, just gone. When I finally got inside, the last shilling
 rolled into a corner of the bathroom. I saw it every day, just sitting there, and I kept wondering: Could this one shilling ever feel
  important again?

Everyday i would wonder if the one shiling could find
its value again. Like a dustin placed outside the shop, where everyone would dump there one shilling coins and oce it got  to a good amount, 
a random lucky shopper would be awarded with it. I don't own a shop, but that idea stuck with me.

So, I decided to build something. A online platform where anyone – can toss in their extra shillings. 
A community led initiative, where every single shilling gets a chance to matter again.

After several months of building, we have Shilling – bringing back the true worth of your shilling.
</p>
<img 
src="/love.svg" 
className="w-8 h-8 mb-6 mx-auto md:mx-0 md:ml-0" 
/>

 <p className="font-semibold text-md">Lexanda Mbelenzi</p>
<p className="text-sm text-opacity-80"> Hodii Founder & CEO</p>
</div>

{/* Adjust vertical alignment with self-start or self-end */}
<div className=" self-end ">
<img src="/ceo.png" className=" h-[500px] top-0 mr-0 md:mr-[42px] mt-0 md:mt-[80px] object-cover" />
</div>
</div>


</div>





<div className="flex flex-col md:px-[80px] items-center justify-center">
<div>
<div className="flex flex-col items-center justify-center mb-[40px] pt-9 pb-9 rounded-2xl gap-5">
<div className="grid grid-cols-1 mx-auto md:grid-cols-3 gap-6 mt-8 w-full px-4">
  {[
    {
      text: "About Us - Shilingi is a micro-contribution and reward platform built for fun and community empowerment. We believe every small contribution can make a big difference.",
      icon: "negotiation.webp",
    },
    {
      text: " Our Mission - To build a trusted place where anyone can toss in their little bit, knowing it's part of something bigger and stand a chance to change someone's life – or even your own. We do it all with trust, transparency, and teamwork.",
      icon: "business-and-career.webp",
    },
    {
      text: "Our Vision - To be the go-to spot where everyone feels like their small contributions truly matters. Millions of people coming together to create real change, making sure every coin helps build a brighter, more connected community.",
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
      <p className="text-lg md:text-2xl font-bold text-[var(--textColor)] mt-[70px] md:mt-[100px] ">
        {item.text}
      </p>
    </div>
  ))}
</div>
</div>
</div>
</div>



</div>

   
</div>


  






      <div className="flex items-center justify-center text-[var(--textColor)] mx-auto">
  <div className="text-center">
    <p className="mt-2 text-sm md:text-lg">
      Contact us shilingi@gmail.com or call +254 703 394794
    </p>
  </div>
</div>

      <Footer />


    
    </div>
    </div>
    </div>
    )}
  </>

  );
};

export default AboutPage;


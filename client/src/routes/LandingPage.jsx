import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Partners from "../components/Patners";
import StoryLine from "../components/StoryLine";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";
import SpinnerMini from "../components/Loader";

const LandingPage = () => {
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
        <SpinnerMini />
      </div>
    ) : (
      <div>
        <Navbar />
    


      <div>
        <Helmet>
        <title>The #1 Free App to Unlock the Best Ideas from Top Books! - Hodii Best Book Summaries</title>

        <meta name="description" content="Hodii is the #1 award-winning book summary app and website, trusted by 40M+ users worldwide and 100K+ daily readers. Get smarter in just 15 minutes with our free, concise summaries of best-selling books. Join us today—learn and grow, one book summary at a time! " />

        <meta name="keywords" content="book summaries, knowledge empowerment, bestselling books, transformative ideas, thought leadership, business books, self-help summaries, industry insights, personal growth, productivity hacks, motivation, innovation strategies, creative thinking, mind mastery, leadership skills, financial wisdom, success mindset, breakthrough thinking, wisdom for life, practical knowledge, learning shortcuts, brain boost, rapid reading, book digest, quick reads, success stories, entrepreneurial mindset, modern wisdom, elite knowledge, mastery techniques, global perspectives, future readiness, book analysis, idea extraction, in-depth reviews, concise knowledge, summary breakdowns, book wisdom, mental expansion, critical thinking, intellectual growth, top books, influential reads, advanced thinking, ultimate book digest, life hacks, professional growth, career mastery, mindset shift, paradigm transformation, unconventional wisdom, practical insights, top nonfiction books, skill enhancement, brain optimization, cognitive skills, mind enhancement, top book reviews, wisdom harvesting, fast knowledge, core ideas, rapid insights, strategic intelligence, innovation fuel, personal development, growth mindset, self-mastery, breakthrough books, smart reading, fast tracking wisdom, peak performance, visionary thinking, knowledge domination, unbeatable learning" />

 
  <meta property="og:title" content="Hodii - Elevate Your Mind" />
  <meta property="og:description" content="Achieve greatness with Hodi. Explore groundbreaking book summaries that transform your life." />
  <meta property="og:image" content="/images/Hodi-og.jpg" />
  <meta property="og:url" content={`${window.location.href}`} />
  <meta property="og:type" content="website" />
  
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Hodii - Elevate Your Mind" />
  <meta name="twitter:description" content="Revolutionize your thinking with powerful book insights on Hodi." />
  <meta name="twitter:image" content="/images/Hodi-twitter.jpg" />
  
  <script type="application/ld+json">
    {`{
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Hodi",
      "url": "${window.location.href}",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "${window.location.href}/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }`}
  </script>
  
  <link rel="canonical" href={`${window.location.href}`} />
  
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
</Helmet>



    <div className="mb-9  flex flex-col gap-0">

    <div>


    <div className="relative w-full text-white text-center">
  {/* Text content absolutely positioned on top of image */}
  <div className="absolute top-[50px] left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center">
    <h1 className="text-3xl md:text-6xl font-bold">Hodii</h1>
    <p className="mt-2 text-md md:text-xl">
      Making your dream home come true everyday
    </p>
  </div>

  {/* Background image */}
  <img
    src="/house.jpg"
    className="w-full  mx-auto"
    alt="Dream home"
  />
</div>



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
<h3 className="text-3xl md:text-5xl font-bold mt-4 mb-4">How did the idea of Hodii come?</h3>
<p className="text-sm md:text-lg max-w-md mb-6">
 I never thought that i would have
 to move out and go house hunting again, but trust me, i can't find a house online even four years later and i am not hawking for a whole week
 out in the sun, mud and dust.
 The idea of  building an all in one real-estate marketplace first came to me during my day day in campus. It was probably the hotest and 
 dustiest day of the year. The kind of eperience you never want to go through twice. 
 I believe that there are other people out there who share the same pain point and i'd better make this idea come true.

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

   <Partners />


   <div
         className="bg-[var(--bodyBg)] p-4 md:p-9 mt-[10px] mx-3 md:mx-9 rounded-lg md:rounded-[30px]
           text-white text-center animate-fadeIn flex flex-col items-center justify-center"
       >
       

         <div className="flex bg-[var(--bd2)] flex-col max-w-full md:max-w-[900px] m gap-2 md:gap-4 rounded-lg md:rounded-[20px] p-2 md:p-6 md:flex-row">
  <img
    src="/heropic.jpg"
    className="w-[200px] rounded-lg md:rounded-[20px] md:w-2/5 mx-auto md:mx-0"
  />
  <div className="md:w-3/5 items-start justify-start md:text-left">
    <p className="text-xs mt-5 md:mt-9 text-[var(--bg2)]  md:text-md">ABOUT US</p>
    <p className="text-md mt-1 md:mt-2 text-[var(--bg)] md:text-2xl font-semibold">
      Still wondering what is Hodii app?
    </p>
    <p className="text-sm text-[var(--bg)] mt-1 md:mt-2 md:text-lg">
      Hodii is a global EdTech startup with Kenyan roots. Hodii app offers
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
    </div>
    )}
  </>

  );
};

export default LandingPage;

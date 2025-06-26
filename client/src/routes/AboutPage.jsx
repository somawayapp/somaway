import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";

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
  <div className="absolute top-[50px] left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center">
    <h1 className="text-3xl md:text-6xl font-bold">Hodii</h1>
    <p className="mt-2 text-md md:text-2xl">
      Where all dreams come true    </p>
  </div>

  {/* Background image */}
  <img
    src="/thumbnail2.jpg"
    className="w-full md:h-[90vh] mx-auto"
    alt="Dream home"
  />
</div>


<div >


<div className="flex   md:px-[80px] flex-col items-center justify-center">
<div>
<div className="flex flex-col items-center justify-center mb-[40px] pt-9 pb-9 rounded-2xl gap-5">
<div className="grid grid-cols-1 mx-auto md:grid-cols-3 gap-6 mt-8 w-full px-4">
  {[
    {
      text: "2024 –  Hodii founded by Lexanda Mbelenzi",
      icon: "rocket.svg",
    },
    {
      text: " Hodii has grown from a 1-person startup into a team of 5+ people in 3 months",
      icon: "smile.svg",
    },
    {
      text: "Now,  Hodii has offices in Nairobi, Mombasa, and Kisumu.",
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
      <p className="text-lg md:text-2xl font-bold text-[var(--textColor)] mt-[70px] md:mt-[100px] ">
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
I never thought I’d have to move out and go house hunting again. But here I am—four years later—and I still can’t find a decent house online. 
And trust me, I’m not about to spend a whole week under the scorching sun, trudging through mud and dust.

The idea of building an all-in-one real estate marketplace first came to me during my campus days. It was probably the hottest, dustiest day of
 the year—one of those experiences you never want to go through twice.

I know I’m not alone in this. There are countless others who’ve faced the same frustration. That’s why I’m determined to bring this idea to life.
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
<img src="/ceo.png" className=" h-[500px] top-0 md:top-[150px] mr-0 md:mr-[42px] mt-0 md:mt-[300px] object-cover" />
</div>
</div>


</div>

<div className= "bg-[#6402db]  hidden md:block  h-[23vh]">

</div>




<div className="flex flex-col md:px-[80px] items-center justify-center">
<div>
<div className="flex flex-col items-center justify-center mb-[40px] pt-9 pb-9 rounded-2xl gap-5">
<div className="grid grid-cols-1 mx-auto md:grid-cols-3 gap-6 mt-8 w-full px-4">
  {[
    {
      text: "Who we are – Hodii is an all-in-one real estate marketplace built to make house hunting effortless, and accessible.",
      icon: "negotiation.webp",
    },
    {
      text: "Mission – To simplify and transform the way people find, rent, or buy homes by offering a smarter, stress-free experience.",
      icon: "business-and-career.webp",
    },
    {
      text: "Vision – To become the go-to real estate platform for millions, redefining property discovery across Africa and beyond.",
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
      Contact us Hodii@gmail.com or call +254 703 394794
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


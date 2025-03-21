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


    <Helmet>
    <title>{`${data.title || 'Best '} by ${data.author || 'Somaway'} Book Summary`}</title>

    <meta name="description" content={` ${data.summary} `} />
    <meta name="keywords"  content={`book title ${data.title}, author ${data.author} category ${data.category},  knowledge empowerment, Somaway, book summaries, knowledge empowerment, bestselling books, transformative ideas, thought leadership, business books, self-help summaries, industry insights, personal growth, productivity hacks, motivation, innovation strategies, creative thinking, mind mastery, leadership skills, financial wisdom, success mindset, breakthrough thinking, wisdom for life, practical knowledge, learning shortcuts, brain boost, Best book summaries, rapid reading, book digest, quick reads, success stories, entrepreneurial mindset, modern wisdom, elite knowledge, mastery techniques, global perspectives, future readiness, book analysis, idea extraction, in-depth reviews, concise knowledge, summary breakdowns, book wisdom, mental expansion, critical thinking, intellectual growth, top books, influential reads, advanced thinking, ultimate book digest, life hacks, professional growth, career mastery, mindset shift, paradigm transformation, unconventional wisdom, practical insights, top nonfiction books, skill enhancement, brain optimization, cognitive skills, mind enhancement, top book reviews, wisdom harvesting, fast knowledge, core ideas, rapid insights, strategic intelligence, innovation fuel, personal development, growth mindset, self-mastery, breakthrough books, smart reading, fast tracking wisdom, peak performance, visionary thinking, knowledge domination, unbeatable learning.`} />

    <meta property="og:description" content={`Experience the most profound interpretation of ${data.title} - A book summary that redefines insight and analysis.`} />
    <meta property="og:image" content={data.img} />
    <meta property="og:url" content={`${window.location.href}`} />
    <link rel="canonical" href={`${window.location.href}`} />
</Helmet>

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
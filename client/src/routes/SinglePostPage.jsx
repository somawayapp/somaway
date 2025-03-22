
          import { Link, useParams } from "react-router-dom";
          import Image from "../components/Image";
          import PostMenuActions from "../components/PostMenuActions";
          import Comments from "../components/Comments";
          import axios from "axios";
          import { useQuery } from "@tanstack/react-query";
          import { format } from "timeago.js";
          import Navbar from "../components/navbar2";
          import { FaStar } from "react-icons/fa";
          import Footer from "../components/Footer";
          import ExplorePosts from "../components/ExplorePosts";
          import MobileControls from "../components/MobileControls";
          import LatestPosts from "../components/LatestPosts";
          import { useEffect } from "react";
          import { Helmet } from "react-helmet";
          import { useState } from "react";
          import BackButton from "../components/BackButton";
          import SpinnerMini from "../components/Loader";
          import Button from "../components/Button";
          
          const fetchPost = async (slug) => {
             
          
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${slug}`);
            return res.data;
          };
          
          const SinglePostPage = () => {
            useEffect(() => {
              window.scrollTo(0, 0); // Scrolls to the top when this component mounts
            }, []);
            const { slug } = useParams();
          
            const { isPending, error, data } = useQuery({
              queryKey: ["post", slug],
              queryFn: () => fetchPost(slug),
            });
          
            const [isLoading, setIsLoading] = useState(false);

              const handleClick = () => {
                window.open(`https://wa.me/${data.whatsapp}`, "_blank");
              };

            const [popupImage, setPopupImage] = useState(null);
          
            // Prevent scrolling when popup is open
            useEffect(() => {
              if (popupImage) {
                document.body.style.overflow = "hidden";
              } else {
                document.body.style.overflow = "auto";
              }
            }, [popupImage]);
            
            
            const images = data?.img || []; // Ensure img is used
            const mainImage = images.length > 0 ? images[0] : null;
            const secondMainImage = images.length > 1 ? images[1] : null;
            const thirdMainImage = images.length > 2 ? images[2] : null;
            const fourthMainImage = images.length > 3 ? images[3] : null;
            const fifthMainImage = images.length > 4 ? images[4] : null;

          
            if (isPending) return "loading...";
            if (error) return "Something went wrong!" + error.message;
            if (!data) return "Post not found!";
          
            return (
              <div className=" bg-[var(--bg)]">
          
          
          
                <Navbar />
                <Helmet>
    <title>{`${data.title || 'Best '} by ${data.author || 'Somaway'} Book Summary`}</title>

    <meta name="description" content={` ${data.summary} `} />
    <meta name="keywords"  content={`book title ${data.title}, author ${data.author} category ${data.category},  knowledge empowerment, Somaway, book summaries, knowledge empowerment, bestselling books, transformative ideas, thought leadership, business books, self-help summaries, industry insights, personal growth, productivity hacks, motivation, innovation strategies, creative thinking, mind mastery, leadership skills, financial wisdom, success mindset, breakthrough thinking, wisdom for life, practical knowledge, learning shortcuts, brain boost, Best book summaries, rapid reading, book digest, quick reads, success stories, entrepreneurial mindset, modern wisdom, elite knowledge, mastery techniques, global perspectives, future readiness, book analysis, idea extraction, in-depth reviews, concise knowledge, summary breakdowns, book wisdom, mental expansion, critical thinking, intellectual growth, top books, influential reads, advanced thinking, ultimate book digest, life hacks, professional growth, career mastery, mindset shift, paradigm transformation, unconventional wisdom, practical insights, top nonfiction books, skill enhancement, brain optimization, cognitive skills, mind enhancement, top book reviews, wisdom harvesting, fast knowledge, core ideas, rapid insights, strategic intelligence, innovation fuel, personal development, growth mindset, self-mastery, breakthrough books, smart reading, fast tracking wisdom, peak performance, visionary thinking, knowledge domination, unbeatable learning.`} />

    <meta property="og:description" content={`Experience the most profound interpretation of ${data.title} - A book summary that redefines insight and analysis.`} />
    <meta property="og:image" content={data.img} />
    <meta property="og:url" content={`${window.location.href}`} />
    <link rel="canonical" href={`${window.location.href}`} />
</Helmet>
                <div className="flex flex-col p-3 md:p-9 gap-4">
          
            
                <div className="max-w-[1200px] mx-auto">


     <div className="w-full mt-[-13px]  mb-[15px] flex items-center justify-between  text-[var(--textColor)]">
      <div>
      <h1 className="text-xl md:text-2xl font-semibold text-left">
        {data.title}
  </h1>
  <h1 className="text-md md:text-lg text-[var(--softTextColor)] font-normal text-left">
    {data.bedrooms}
    <span className="pl-1 font-normal">Bedroom</span>
    <span className="pl-1 font-normal">{data.propertytype}</span>

  </h1>
      </div>
 

  <BackButton/>
</div>





        
          
          
          
          <div className="w-full flex h-[300px] md:h-[500px] overflow-hidden rounded-xl aspect relative transition duration-300">
          {/* Left Div */}
          <div className="flex-1 h-full overflow-hidden relative mr-1">
          {mainImage && (
          <img src={mainImage} className="object-cover h-full w-full" alt="Image" />
          )}
          </div>
          
          {/* Right Div */}
          <div className="w-1/4 h-full flex gap-1 flex-col">
          {[secondMainImage, thirdMainImage, fourthMainImage, fifthMainImage].map(
          (image, index) =>
            image && (
              <div
                key={index}
                className="w-full h-1/4  overflow-hidden relative cursor-pointer"
                onClick={() => setPopupImage(image)}
              >
                <img src={image} className="object-cover h-full w-full" alt="Image" />
              </div>
            )
          )}
          </div>
          
          {/* Popup Modal */}
          {popupImage && (
          <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center " style={{ zIndex: 100014 }}
          onClick={() => setPopupImage(null)}
          >
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setPopupImage(null)}>
          <div
          className="relative w-full p-3 md:p-9 md:w-3/4"
          onClick={(e) => e.stopPropagation()} // Prevents closing when clicking the image
          >
          <button
          className="absolute top-2 right-2 bg-gray-800 text-white rounded-full"
          onClick={() => setPopupImage(null)}  
          style={{ zIndex: 100024 }}
          >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="red"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          </button>
          <img src={popupImage} className="w-full h-auto max-h-[80vh] object-cover rounded-xl" alt="Popup" />
          </div>
          </div>
          
          </div>
          )}
          </div>
          
              
              

    















      <div className="flex flex-col bg-[var(--bg)]  mt-6 
       md:flex-row gap-4 md:gap-8">



          <div className="flex flex-col gap-1 md:gap-2 items-center mt-4 md:items-start md:w-3/5">
            <p className="text-[var(--softTextColor2)] text-sm text-lg  text-center md:text-left">
            SUMMARY OF


            </p>
            <h1 className="text-2xl md:text-5xl font-bold text-center md:text-left">
              {data.title}
            </h1>
            <div className="flex flex-col md:flex-row  items-center gap-1 text-[var(--textColor)] text-md md:text-lg">
              <div className=" flex gap-1 md:gap-2">
                <span  className=" ">Book by
                <Link   to={`/discover?author=${data.author}`} className=" ml-1" >{data.author}</Link>  </span>
                </div>
                <div className="flex gap-1 md:gap-2"> 
                <span className="hidden md:block "> | </span>
                <span className=" ">Category 
                <Link to={`/discover?cat=${data.category}`}  className="capitalize ml-1 ">{data.category}</Link> </span>
                </div>
            </div>
            <div className="flex flex-row items-center mt-2 text-sm md:text-lg">
  {[...Array(5)].map((_, index) => (
    <FaStar key={index} className="text-orange-500 w-[40px] ml-[-15px] " />
  ))}
  <span className="pl-2 font-normal flex items-center">
    <span className="ml-[-5px]">4.8</span>
    <span className="mx-2 flex items-center">·</span>
    {data.visit * 
    42} <span className="ml-1">reviews</span>
  </span>
</div>


            
        

            <p className="mt-2 text-xl mt-1 md:mt-2 md:text-2xl font-bold">
            What’s inside
            </p>
            <p
              className="text-[var(--textColor)] text-[16px] md:text-[19px]"
            >                { data.summary }

            </p>


        <div className="flex flex-row pt-2 space-x-4">
  <div className="flex flex-row items-center space-x-2">
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" width="24px" height="24px">
      <path d="M12.75 7a.75.75 0 0 0-1.5 0v5a.75.75 0 0 0 .352.636l3 1.875a.75.75 0 1 0 .796-1.272l-2.648-1.655V7z" fill="#06F" fill-opacity="0.5"></path>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M12 3.25a8.75 8.75 0 1 0 0 17.5 8.75 8.75 0 0 0 0-17.5zM4.75 12a7.25 7.25 0 1 1 14.5 0 7.25 7.25 0 0 1-14.5 0z" fill="#06F" fill-opacity="0.5"></path>
    </svg>
    <span className="text-[var(--textColor)] text-[16px] md:text-[20px]">
      15 min read
    </span>
  </div>

  <div className="flex flex-row items-center space-x-2">
    <svg viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24px" height="24px">
      <path d="M4.29 7a1 1 0 1 0 0 2 1 1 0 0 0 0-2ZM8.29 7a1 1 0 1 0 0 2h12a1 1 0 1 0 0-2h-12ZM3.29 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0ZM4.29 15a1 1 0 1 0 0 2 1 1 0 0 0 0-2ZM7.29 12a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2h-12a1 1 0 0 1-1-1ZM8.29 15a1 1 0 1 0 0 2h12a1 1 0 1 0 0-2h-12Z" fill="#06F"></path>
    </svg>
    <span className="text-[var(--textColor)] text-[16px] md:text-[20px]">
      Key points
    </span>
  </div>
</div>

           <Link
            to="/login"
            className="w-full text-center mt-3  sm:w-auto px-4 md:px-12 py-4  bg-[#007aff]   text-white font-semibold
             rounded-md hover:bg-[#0062e3]   "
          >
           Try Somaway app

          </Link>
          </div>

          <div className="flex flex-col gap-2 pb-4 md:w-2/5 ">


          <div className="  rounded-xl border-[1px] border-[var(--softBg4)] overflow-hidden">
      <div className="flex flex-row items-center gap-1 p-4">
        <span className="text-lg font-semibold">KES {data.price}</span>
        <span className="font-light ">
  {data.model === "forrent" ? "/month" : data.model === "forsale" ? "for sale" : ""}
</span>
      </div>
      <hr className="h-[1px] bg-[var(--softBg4)] border-0" />

      <div>
  <p
    className="p-4 flex items-center gap-2 cursor-pointer hover:bg--[var(--softBg)] rounded-lg transition"
    onClick={() => window.location.href = `tel:${data.phone}`}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="blue"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2 2 19.79 19.79 0 0 1-8.63-2A19.79 19.79 0 0 1 2 6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 1.72 12.34 12.34 0 0 0 .68 2.72 2 2 0 0 1-.45 2.11l-1.42 1.42a16 16 0 0 0 6 6l1.42-1.42a2 2 0 0 1 2.11-.45 12.34 12.34 0 0 0 2.72.68A2 2 0 0 1 22 16.92z" />
    </svg>
    Contact: <span>{data.phone}</span>
  </p>
</div>

<hr className="h-[1px] bg-[var(--softBg4)] border-0" />
<div>


<div>
      <p
        className="p-4 flex items-center gap-2  cursor-pointer hover:bg--[var(--softBg)] rounded-lg transition-all"
        onClick={handleClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="green"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21.5 12.2c0-5.2-4.3-9.5-9.5-9.5S2.5 7 2.5 12.2a9.5 9.5 0 0 0 1.3 4.9L2 22l5.2-1.7a9.5 9.5 0 0 0 4.8 1.3c5.2 0 9.5-4.3 9.5-9.5z" />
          <path d="M16.5 15.3c-.5.3-1 .5-1.6.6-2.6.6-5.5-1.7-6.7-3.8-.3-.5-.5-1-.6-1.6 0-.5.2-.9.6-1.2.3-.2.7-.2 1.1 0l.9.4c.3.1.6.4.7.7l.2.4c.1.3 0 .6-.2.9-.1.2-.3.4-.3.4s.4.7 1 1.3c.6.6 1.3 1 1.3 1 .1 0 .2-.1.4-.3.3-.2.6-.3.9-.2l.4.2c.3.1.6.3.7.7l.4.9c.1.3.1.8-.1 1.1z" />
        </svg>
        WhatsApp: <span>{data.whatsapp}</span>
      </p>
    </div>

   </div>

   <hr className="h-[1px] bg-[var(--softBg4)] border-0" />
   <div className="p-4">
      <Button
          disabled={isLoading}
          className="flex flex-row items-center justify-center h-[42px]  rounded-xl"
          size="large"
        >
          {isLoading ? <SpinnerMini /> : <span>Check Vacancy</span>}
        </Button>
      </div>
      <hr />
      <div className="p-4 flex flex-row items-center justify-between font-semibold text-lg">
        <span>Total</span>
        <span>KES</span>
      </div>
   
   
          </div>
          
      <div className="hidden md:block">
            <p className="text-[var(--softTextColor2)] mt-5 ">Comments</p>
            <Comments postId={data._id} />
            </div>
    </div>



        </div>
      </div>

      </div>





      <div className="flex flex-col p-4  md:flex-row gap-4 md:px-9 md:pb-9 md:gap-8"> 

            <div className="w-full md:w-1/4 mt-2 md:mt-0 flex justify-center md:block">
          
             </div>

          <div className="flex flex-col gap-1 md:gap-2 items-center md:items-start md:w-2/4">
          <p
  className="desc-content text-[var(--textColor)]"
  dangerouslySetInnerHTML={{
    __html: data.desc
      ?.replace(/&nbsp;/g, ' ') // Convert non-breaking spaces to normal spaces
      .replace(/\s{2,}/g, ' ') // Remove multiple spaces
  }}
/>


              <div className="block md:hidden text-center">
          <p className="text-[var(--softTextColor2)] mt-2">Comments</p>
          <div className="flex justify-center">
          <Comments postId={data._id} />
          </div>
          </div>




      <div className="flex flex-col gap-9 w-full mt-9">
      
          <div
            className="bg-[var(--bd)] text-[16px] md:text-[20px] shadow-2xl rounded-2xl md:rounded-[20px] p-4 md:px-9 flex flex-col items-start text-left relative"
          >
            <h1 className=" text-xl mt-1 md:mt-2 md:text-2xl font-bold">
            About the author - <span className="pl-1"> {data.author} </span>
            </h1>
         
         <p
        className="desc-content pb-2 md:pb-4 text-[var(--textColor)]"
        dangerouslySetInnerHTML={{ __html: data.aboutauthor }}
        />
          </div>

          <div
            className="bg-[var(--bd)] text-[16px] md:text-[20px] shadow-2xl rounded-2xl md:rounded-[20px] p-4 md:px-9 flex flex-col items-start text-left relative"
          >
               <h1 className=" text-xl mt-1 md:mt-2 md:text-2xl font-bold">
            What is <span className="pl-1 pr-1"> {data.title} </span> about?
            </h1>
         
         <p
        className="desc-content pb-2 md:pb-4 text-[var(--textColor)]"
        dangerouslySetInnerHTML={{ __html: data.aboutbook }}
        />
          </div>

          <div
            className="bg-[var(--bd)] text-[16px] md:text-[20px] shadow-2xl rounded-2xl md:rounded-[20px] p-4 md:px-9 flex flex-col items-start text-left relative"
          >
              <h1 className=" text-xl mt-1 md:mt-2 md:text-2xl font-bold">
            Who should read <span className="pl-1"> {data.title} </span> 
            </h1>
         
         <p
        className="desc-content  pb-2 md:pb-4 text-[var(--textColor)]"
        dangerouslySetInnerHTML={{ __html: data.whoshouldread }}
        />
          </div>
  </div>



          </div>


          <div className="flex flex-col gap-2 items-start md:w-1/4">

          </div>
        </div>




      
 <div className="mb-[20px] px-3 md:px-9  ">
<div>
      <h3 className="text-xl md:text-3xl ml-2 mt-7 mb-3 md:mb-6 md:mt-10 font-bold text-[var(--textColor)]">
      We also recommend     </h3>
    </div>
   <LatestPosts />
</div>



<div className="flex items-center justify-center text-[var(--textColor)] mx-auto">

    <div className="flex justify-center ">
      <PostMenuActions post={data} />
    </div>


    
         
   </div>
   <Footer/>     
   </div>
  );
};

export default SinglePostPage;
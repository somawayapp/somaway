
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


     <div className="w-full mt-[-13px]  mb-[13px] flex items-center justify-between  text-[var(--textColor)]">
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
          
              
              

    















      <div className="flex flex-col bg-[var(--bg)]  mt-4 border border-[var(--softBg4)]  rounded-3xl  
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

          <div className="flex flex-col gap-2 items-start md:w-2/5">
          <div className="pb-4">


          <div className=" rounded-xl border-[1px] border-neutral-200 overflow-hidden">
      <div className="flex flex-row items-center gap-1 p-4">
        <span className="text-lg font-semibold">KES {data.price}</span>
        <span className="font-light text-[var(--softTextColor)]">
  {data.model === "forrent" ? "/month" : data.model === "forsale" ? "for sale" : ""}
</span>
      </div>
      <hr />

   <div>
   <p className="p-4 flex items-center gap-2">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5 text-blue-500"
  >
    <path
      fillRule="evenodd"
      d="M6.68 3.27a2.5 2.5 0 00-2.74-.54l-1.14.47a2.5 2.5 0 00-1.4 3.26c1.04 2.76 2.79 5.32 5.07 7.6s4.84 4.03 7.6 5.07a2.5 2.5 0 003.26-1.4l.47-1.14a2.5 2.5 0 00-.54-2.74l-2.02-2.02a2.5 2.5 0 00-2.94-.45l-1.22.62a11.07 11.07 0 01-4.81-4.81l.62-1.22a2.5 2.5 0 00-.45-2.94L6.68 3.27z"
      clipRule="evenodd"
    />
  </svg>
  Contact: <span>{data.phone}</span>
</p>

<p className="p-4 flex items-center gap-2">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5 text-green-500"
  >
    <path
      fillRule="evenodd"
      d="M12.003 2.004c5.524 0 10 4.478 10 10.002a9.963 9.963 0 01-2.922 7.073l-.184.184-2.258-.655a8.008 8.008 0 01-3.09-.07 7.938 7.938 0 01-3.637-2.18 7.93 7.93 0 01-2.178-3.637 8.008 8.008 0 01-.07-3.09l.655-2.258.184-.184A9.963 9.963 0 0112.003 2.004zm0 2a8 8 0 00-5.658 13.658l.121.127-.514 1.768 1.768-.514.127.121A7.962 7.962 0 0012.003 20c4.42 0 8-3.582 8-7.994 0-4.42-3.582-8.002-8-8.002zM9.222 7.75a.75.75 0 011.038-.196l.292.204c.42.294.985.687 1.254.825.232.118.448.119.692.041.232-.074.498-.194.817-.37.14-.073.276-.144.401-.202.358-.167.748-.075 1.018.171l.172.153c.319.282.482.76.377 1.181l-.054.224a4.977 4.977 0 01-.365 1.07c-.145.34-.32.69-.53 1.036a5.782 5.782 0 01-.869 1.15 3.432 3.432 0 01-2.229.996 3.632 3.632 0 01-2.012-.6 8.342 8.342 0 01-1.947-1.65 8.25 8.25 0 01-1.653-2.65 3.606 3.606 0 01-.186-1.96 3.372 3.372 0 01.997-2.057 5.78 5.78 0 011.15-.869c.346-.21.696-.385 1.036-.53a4.977 4.977 0 011.07-.365l.224-.054c.421-.105.899.058 1.181.377l.153.172c.246.27.338.66.171 1.018a7.487 7.487 0 01-.202.401c-.176.319-.296.585-.37.817-.078.244-.077.46.041.692.138.269.531.834.825 1.254l.204.292a.75.75 0 01-.196 1.038l-.22.154c-.39.273-.862.48-1.337.565-.477.085-.984.059-1.466-.098a9.704 9.704 0 01-1.142-.49 9.85 9.85 0 01-1.434-.925c-.103-.08-.183-.14-.237-.187a.75.75 0 01-.18-.859l.136-.312a9.75 9.75 0 011.25-2.169l.148-.208a.75.75 0 01.871-.242l.22.096c.312.135.634.325.963.575z"
      clipRule="evenodd"
    />
  </svg>
  <span>{data.whatsapp}</span>
</p>


   </div>

      <hr />
      <div className="p-4">
      <Button
          disabled={isLoading}
          className="flex flex-row items-center justify-center h-[42px]  rounded-xl"
          size="large"
        >
          {isLoading ? <SpinnerMini /> : <span>Book a Tour</span>}
        </Button>
      </div>
      <hr />
      <div className="p-4 flex flex-row items-center justify-between font-semibold text-lg">
        <span>Total</span>
        <span>KES</span>
      </div>
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
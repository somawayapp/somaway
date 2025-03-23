import axios from "axios";
import Comment from "./Comment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import { useState } from "react";
import { BiCommentDetail } from "react-icons/bi";
import { Send } from "lucide-react";
import Button from "./Button";


const fetchComments = async (postId) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/comments/${postId}`
  );
  return res.data;
};

const Comments = ({ postId }) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const [showComments, setShowComments] = useState(false); // Toggle comment box
  const [visibleComments, setVisibleComments] = useState(3); // Initial visible comments
  const [commentSuccess, setCommentSuccess] = useState(false); // Temporary success message

  const { isPending, error, data = [] } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
  });

  const mutation = useMutation({
    mutationFn: async (newComment) => {
      const token = await getToken();
      return axios.post(
        `${import.meta.env.VITE_API_URL}/comments/${postId}`,
        newComment,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      setCommentSuccess(true);
      setTimeout(() => setCommentSuccess(false), 2000); // Remove message after 2 seconds
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
      desc: formData.get("desc"),
    };

    mutation.mutate(data);
    e.target.reset(); // Clear the input field
  };

  const loadMoreComments = () => {
    setVisibleComments((prev) => prev + 5); // Load 5 more comments
  };

  const closeComments = () => {
    setShowComments(false);
    setVisibleComments(3); // Reset to initial state
  };

  return (
    <div className="flex flex-col gap-1 mb-2">
      {/* Modern Comment Icon */}
      <Button
          onClick={() => setShowComments((prev) => !prev)}       
          className="flex flex-row items-center  text-[14px] md:text-[16px] justify-center h-[42px]  text-white  rounded-xl"
          size="large"
        >
        <span> Property Reviews</span>
        </Button>
        
      
   

      {/* Comments Section */}
      {showComments && (
        <>
          <form
            onSubmit={handleSubmit}
            className="flex items-center  bg-[var(--bd)] text-[var(--textColor)] rounded-xl justify-between mt-5  shadow-xl  border-[0.5px]
             w-full border-[var(--softBg4)]"
          >
            <textarea
              name="desc"
              placeholder="Write a review..."
              className="w-full pt-1  text-[14px] md:text-[16px]  bg-[var(--bd)]  border-[0.5px]  w-full border-[var(--softBg4)] rounded-xl py-2 px-6   mb-[-2px]
               pl-4 text-[var(--textColor)] rounded-xl"
            />
            <button className="px-1 ">
            <Send className=" h-[40px] pr-1 text-[#ff4d52] " />

            </button>
          </form>

          {commentSuccess && (
            <p className="text-green-500  text-[14px] md:text-[16px]">Review added successfully!</p>
          )}

          {isPending ? (
            "Loading..."
          ) : error ? (
            "Error loading reviews!"
          ) : (
            <>
              {data.slice(0, visibleComments).map((comment) => (
                <div
                  key={comment._id}
                  className=" p-2 rounded-2xl  text-[14px] md:text-[16px] shadow-2xl mt-3"
                >
                  <Comment comment={comment} postId={postId} />
                </div>
              ))}

              {visibleComments < data.length && (
                <button
                  onClick={loadMoreComments}
                  className=" text-sm text-[#1DA1F2]   border-[0.2px] border-[#1DA1F2]
               px-1 py-[0.5px] rounded-xl  "
                >
                  Show more reviews
                </button>
              )}
              <button
                onClick={closeComments}
                className="text-[#ff4d52]  border-[0.2px] border-[#ff4d52]
               px-1 py-[0.5px] rounded-xl   text-sm mt-2"
              >
                Close review
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Comments;

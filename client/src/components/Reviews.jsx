import axios from "axios";
import Comment from "./Comment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import { useState } from "react";
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

  const [visibleComments, setVisibleComments] = useState(6); // Increased initial visible comments
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

  return (
    <div className="flex flex-col gap-1 mb-2">

     

      {isPending ? (
        "Loading..."
      ) : error ? (
        "Error loading reviews!"
      ) : (
        <>
          {data.slice(0, visibleComments).map((comment) => (
            <div
              key={comment._id}
              className="p-2 rounded-2xl text-[14px] md:text-[16px] shadow-2xl mt-3"
            >
              <Comment comment={comment} postId={postId} />
            </div>
          ))}

          {visibleComments < data.length && (
            <button
              onClick={loadMoreComments}
              className="text-sm text-[#1DA1F2] mt-2 border-[0.2px] border-[#1DA1F2] px-1 py-[0.5px] rounded-xl"
            >
              Show more reviews
            </button>
          )}
        </>
      )}
    </div>
  );
};


export default Reviews;

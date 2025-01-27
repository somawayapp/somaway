import axios from "axios";
import Comment from "./Comment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import { useState } from "react";

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

  return (
    <div className="flex flex-col gap-1 lg:w-4/5 mb-2">
      {/* Comments Section */}
      <h1 className="text-md font-bold text-[var(--textColor)]">What others say</h1>
      <form
        onSubmit={handleSubmit}
        className="flex items-center bg-[var(--textColore)] text-[var(--textColor)] justify-between gap-1 w-full"
      >
        <textarea
          name="desc"
          placeholder="Write a comment..."
          className="w-full pt-1 bg-[var(--textColore)] border-none text-sm mb-[-2px]
               pl-4 text-[var(--textColor)] rounded-xl"
        />
        <button className="bg-blue-700 px-4 ml-5 py-3 text-white text-sm rounded-xl">
          Send
        </button>
      </form>

      {commentSuccess && (
        <p className="text-green-500">Commented successfully!</p>
      )}

      {isPending ? (
        "Loading..."
      ) : error ? (
        "Error loading comments!"
      ) : (
        <>
          {data.slice(0, visibleComments).map((comment) => (
            <Comment key={comment._id} comment={comment} postId={postId} />
          ))}

          {visibleComments < data.length && (
            <button
              onClick={loadMoreComments}
              className="text-sm text-blue-700"
            >
              Show More
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Comments;

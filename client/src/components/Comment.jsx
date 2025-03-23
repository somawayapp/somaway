import { format } from "timeago.js";
import Image from "./Image";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";

const Comment = ({ comment, postId }) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const role = user?.publicMetadata?.role;

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return axios.delete(
        `${import.meta.env.VITE_API_URL}/comments/${comment._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success("Review deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  return (
    <div className="p-2  pl-4 bg-[var(--bd)] rounded-xl mb-1">
      <div className="flex items-center gap-1">
        {comment.user.img && (
            <img
            className="rounded-full text-[14px] md:text-[16px]  w-[20px] md:w-[30px] h-[20px] md:h-[30px] select-none"
            alt="Avatar"
            src={comment.user.img || "/placeholder.jpg"} 
          />
        )}
        <span className=" text-[var(--softTextColor2)]  text-[14px] md:text-[16px]   font-light">{comment.user.username}</span>
    
        {user &&
          (comment.user.username === user.username || role === "admin") && (
            <span
              className="text-xs text-right align-right item-right text-red-300 hover:text-red-500 cursor-pointer"
              onClick={() => mutation.mutate()}
            >
              delete
              {mutation.isPending && <span>(in progress)</span>}
            </span>
          )}
      </div>
      <div className="mt-1">
        <p className=" text-[14px] md:text-[16px]">{comment.desc}</p>
      </div>
    </div>
  );
};

export default Comment;

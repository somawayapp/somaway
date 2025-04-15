import { useUser, useAuth } from "@clerk/clerk-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState, useRef, useEffect } from "react";

const PostMenuActions = ({ post }) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const {
    isPending,
    error,
    data: savedPosts,
  } = useQuery({
    queryKey: ["savedPosts"],
    queryFn: async () => {
      const token = await getToken();
      return axios.get(`${import.meta.env.VITE_API_URL}/users/saved`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
  });

  const isAdmin = user?.publicMetadata?.role === "admin" || false;
  const isSaved = savedPosts?.data?.some((p) => p === post._id) || false;

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return axios.delete(`${import.meta.env.VITE_API_URL}/posts/${post._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      toast.success("Post deleted successfully!");
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return axios.patch(
        `${import.meta.env.VITE_API_URL}/users/save`,
        {
          postId: post._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedPosts"] });
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  const toggleListing = useMutation({
    mutationFn: async (isListed) => {
      const token = await getToken();
      return axios.patch(
        `${import.meta.env.VITE_API_URL}/posts/${post._id}`,
        { isListed }, // Pass isListed in the body!
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: (data) => {
      toast.success(`Post has been ${data.data.isListed ? "relisted" : "unlisted"}!`);
      queryClient.invalidateQueries(); // Refresh post state
    },
    onError: (error) => {
      console.error("Toggle listing mutation failed:", error);
  
      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        "Unknown error occurred.";
  
      toast.error(`Failed to update listing: ${message}`);
    }
  });
  
  

  

  const toggleFeatured = useMutation({
    mutationFn: async (isFeatured) => {
      const token = await getToken();
      return axios.patch(
        `${import.meta.env.VITE_API_URL}/posts/feature/${post._id}`,
        { isFeatured }, // Pass isListed in the body!
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: (data) => {
      toast.success(`Post has been ${data.data.isFeatured ? "Boosted" : "Unboosted"}!`);
      queryClient.invalidateQueries(); // Refresh post state
    },
    onError: (error) => {
      console.error("Toggle listing mutation failed:", error);
  
      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        "Unknown error occurred.";
  
      toast.error(`Failed to update listing: ${message}`);
    }
  });
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDelete = () => {
    deleteMutation.mutate();
    setDropdownOpen(false);
  };

  const handleFeature = () => {
    featureMutation.mutate();
    setDropdownOpen(false);
  };



  return (
<div className="relative z-10">
  {/* Three dots icon */}
  <div
    onClick={() => setDropdownOpen(true)} // Open the dropdown
    className="cursor-pointer"
  >
  <svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  width="24" // Adjusted width for horizontal spacing
  height="14" // Reduced height for better alignment
  className="text-[var(--textColor)]"
>
  <circle cx="4" cy="12" r="2" fill="currentColor" />
  <circle cx="12" cy="12" r="2" fill="currentColor" />
  <circle cx="20" cy="12" r="2" fill="currentColor" />
</svg>

  </div>


{/* If dropdown is open, clicking it again closes it */}
{dropdownOpen && (
  <div
    ref={dropdownRef}
    className="absolute right-0 bg-[var(--textColore)] border-[var(--softColor7)] rounded shadow-lg p-2 mt-2 w-48"
    onClick={() => setDropdownOpen(false)} // Close dropdown when clicking inside
  >
    {/* Dropdown content */}
  </div>
)}



      {/* Dropdown menu */}
      {dropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 bg-[var(--textColore)] border-[var(--softColor7)] rounded shadow-lg p-2 mt-2 w-48"
        >
{user && (post.user.username === user.username || isAdmin) && (
  <button
    onClick={() => toggleFeatured.mutate(!post.isFeatured)}
    className="w-full text-left px-4  text-sm hover:bg-[var(--softColor5)] text-[var(--textColor)]"
  >
    {post.isFeatured ? "Unboost this listing" : "Boost this listing"}
  </button>
)}

          
{user && (post.user.username === user.username || isAdmin) && (
  <button
    onClick={() => toggleListing.mutate(!post.isListed)}
    className="w-full text-left px-4  text-sm hover:bg-[var(--softColor5)] text-[var(--textColor)]"
  >
    {post.isListed ? " Unlist this property" : "Relist this property"}
  </button>
)}

{user && (post.user.username === user.username || isAdmin) && (
  <button
    onClick={() => toggleListing.mutate(!post.isListed)}
    className="w-full text-left px-4  text-sm hover:bg-[var(--softColor5)] text-[var(--textColor)]"
  >
    {post.isListed ? "This property is Not vacant" : " This property is Vacant"}
  </button>
)}
          {user && (post.user.username === user.username || isAdmin) && (
            <div
              className="flex items-center px-4 gap-2 py-2 text-[var(--textColor)] text-sm cursor-pointer"
              onClick={handleDelete}
            >
              <span>Delete</span>
              {deleteMutation.isPending && (
                <span className="text-xs">(in progress)</span>
              )}
            </div>
          )}
       
        </div>
      )}
    </div>
  );
};

export default PostMenuActions;

import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import ReactQuill from "react-quill-new";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Upload from "../components/Upload"; // Assuming this component handles file uploads and provides preview

import 'react-quill-new/dist/quill.snow.css'; // Import Quill styles

const Write = () => {
  const { isLoaded, isSignedIn } = useUser();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [cover, setCover] = useState(null); // Initially null, will hold the image file and preview URL
  const [progress, setProgress] = useState(0);
  const [titleRemainingChars, setTitleRemainingChars] = useState(150);
  const [descRemainingChars, setDescRemainingChars] = useState(10000);
  const [error, setError] = useState("");
  const [isFeatured, setIsFeatured] = useState(false); // Track if the post is featured
  const [author, setAuthor] = useState(""); // Added author field

  const navigate = useNavigate();
  const { getToken } = useAuth();
  
  const fileInputRef = useRef(null);

  const mutation = useMutation({
    mutationFn: async (newPost) => {
      const token = await getToken();
      return axios.post(`${import.meta.env.VITE_API_URL}/posts`, newPost, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: (res) => {
      toast.success("Post has been created");
      navigate(`/${res.data.slug}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "An error occurred");
    },
  });

  const clearError = () => setError("");

  const handleTitleChange = (e) => {
    const value = e.target.value.slice(0, 150);
    setTitle(value);
    setTitleRemainingChars(150 - value.length);
  };

  const handleDescChange = (value) => {
    setDesc(value);
    setDescRemainingChars(10000 - value.length);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    clearError();

    if (!title) return setError("Please include a title for your post.");
    if (!desc) return setError("Please include a description for your post.");
    if (!category) return setError("Please select a category for your post.");
    if (!cover) return setError("Please upload a cover image for your post.");
    if (!author) return setError("Please enter the author's name.");

    const timestamp = Date.now();
    const slug = title.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "-").toLowerCase() + `-${timestamp}`;

    const data = {
      img: cover.filePath,
      title,
      category,
      desc,
      slug,
      isFeatured,
      author, // Added author field to post data
    };

    mutation.mutate(data);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setCover({ file, previewUrl });

      try {
        const formData = new FormData();
        formData.append("image", file);
        const token = await getToken();
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/upload`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setCover({ file, previewUrl, filePath: res.data.filePath });
      } catch (error) {
        setCover(null);
        setError("Image upload failed, please try again.");
      }
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] max-w-[900px] md:h-[calc(100vh-80px)] flex flex-col top-[20px] lg:top-[100px] gap-6 px-4 py-6">
      <h1 className="text-3xl font-semibold text-[var(--textColor)]">Create a New Post</h1>
      {error && <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg shadow-md">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1">
        <div>
          <Upload type="image" setProgress={setProgress} setData={setCover}>
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" ref={fileInputRef} id="coverImageInput" />
            <label htmlFor="coverImageInput" className="w-max p-3 shadow-md rounded-xl text-sm text-[var(--textColor)] bg-[var(--textColore)] cursor-pointer">
              {progress > 0 && progress < 100 ? "Uploading..." : "Add a cover image"}
            </label>
          </Upload>
        </div>

        {cover && cover.previewUrl && (
          <div className="relative w-full max-w-[250px] h-[150px] mb-4 mx-auto">
            <img src={cover.previewUrl} alt="Cover preview" className="w-full h-full object-cover rounded-md shadow-lg" />
          </div>
        )}
        <input type="text" placeholder="Author Name" value={author} onChange={(e) => setAuthor(e.target.value)} className="text-md font-semibold rounded-xl bg-transparent outline-none p-3 w-full border border-1 border-[var(--textColore)]" />
        <button disabled={mutation.isPending || (progress > 0 && progress < 100)} className="bg-[#1da1f2] hover:bg-[#0875b9] text-white font-medium rounded-xl mt-4 p-3 w-full disabled:bg-blue-400 disabled:cursor-not-allowed">
          {mutation.isPending ? "Publishing..." : "Publish Post"}
        </button>
      </form>
    </div>
  );
};

export default Write;

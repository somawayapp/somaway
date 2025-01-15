import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import ReactQuill from "react-quill-new";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Upload from "../components/Upload";

import "react-quill-new/dist/quill.snow.css";

const Write = () => {
  const { isLoaded, isSignedIn } = useUser();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [cover, setCover] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isFeatured, setIsFeatured] = useState(false);
  const [titleRemainingChars, setTitleRemainingChars] = useState(150);
  const [descRemainingChars, setDescRemainingChars] = useState(10000);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { getToken } = useAuth();

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

    const timestamp = Date.now();
    const slug = `${title.replace(/\s+/g, "-").toLowerCase()}-${timestamp}`;

    const data = {
      img: cover.filePath, // Assuming `filePath` holds the uploaded file's path
      title,
      category,
      desc,
      slug,
      isFeatured,
    };

    mutation.mutate(data);
  };

  if (!isLoaded) {
    return <div className="text-center text-[var(--textColor)] mt-8">Loading...</div>;
  }

  if (isLoaded && !isSignedIn) {
    return <div className="text-center text-[var(--textColor)] mt-8">You need to sign in to create a post!</div>;
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col gap-6 px-4 py-6">
      <h1 className="text-3xl font-semibold text-[var(--textColor)]">Create a New Post</h1>
      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg shadow-md">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1">
        <Upload type="image" setProgress={setProgress} setData={setCover}>
          <button
            type="button"
            onClick={clearError}
            disabled={progress > 0 && progress < 100}
            className="p-3 shadow-md rounded-xl text-sm text-[var(--textColor)] bg-[var(--textColore)] disabled:opacity-50 hover:bg-[var(--softTextColor7)] transition-all duration-200"
          >
            {progress > 0 && progress < 100 ? "Uploading..." : "Add a cover image"}
          </button>
        </Upload>

        {cover && cover.previewUrl && (
          <div className="relative w-full max-w-[250px] h-[150px] mb-4 mx-auto">
            <img
              src={cover.previewUrl}
              alt="Cover preview"
              className="w-full h-full object-cover rounded-md shadow-lg"
            />
            <button
              type="button"
              onClick={() => setCover(null)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-xs"
            >
              ✕
            </button>
          </div>
        )}

        <input
          className="text-md font-semibold rounded-xl bg-transparent outline-none p-3 w-full border border-[var(--textColore)]"
          type="text"
          placeholder="Enter Post Title"
          value={title}
          onChange={handleTitleChange}
          name="title"
        />
        <span className="text-sm text-[var(--textColor)]">{titleRemainingChars} characters remaining</span>

        <select
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-3 rounded-xl bg-[var(--textColore)] text-[var(--textColor)] shadow-md w-full"
        >
          <option value="" disabled>Select a category</option>
          {/* Add your categories here */}
        </select>

        <ReactQuill
          value={desc}
          onChange={handleDescChange}
          className="border border-[var(--textColore)] rounded-xl text-[var(--textColor)]"
          placeholder="A Short Description"
        />
        <span className="text-sm text-[var(--textColor)]">{descRemainingChars} characters remaining</span>

        <div className="flex items-center gap-4">
          <span className="text-sm text-[var(--textColor)]">Mark as Featured:</span>
          <button
            type="button"
            onClick={() => setIsFeatured((prev) => !prev)}
            className={`p-2 rounded-lg ${isFeatured ? "bg-green-500" : "bg-gray-500"} text-white`}
          >
            {isFeatured ? "Featured" : "Not Featured"}
          </button>
        </div>

        <button
          disabled={mutation.isPending || (progress > 0 && progress < 100)}
          className="bg-[#1da1f2] hover:bg-[#0875b9] text-white font-medium rounded-xl mt-4 p-3 w-full disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? "Publishing..." : "Publish Post"}
        </button>
      </form>
    </div>
  );
};

export default Write;

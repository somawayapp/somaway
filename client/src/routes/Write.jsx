import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import ReactQuill from "react-quill-new";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Upload from "../components/Upload";

import 'react-quill-new/dist/quill.snow.css';

const Write = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [cover, setCover] = useState(null);
  const [progress, setProgress] = useState(0);
  const [titleRemainingChars, setTitleRemainingChars] = useState(150);
  const [descRemainingChars, setDescRemainingChars] = useState(10000);
  const [error, setError] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

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

    const timestamp = Date.now();
    let slug = title.replace(/\s+/g, "-").toLowerCase().replace(/[^a-z0-9-]+$/, "");

    const data = {
      img: cover.filePath,
      title,
      category,
      desc,
      slug: `${slug}-${timestamp}`,
      isFeatured,
      author: user?.fullName || "Anonymous",
    };

    mutation.mutate(data);
  };

  if (!isLoaded) {
    return <div className="text-center text-[var(--textColor)] mt-8">Loading...</div>;
  }

  if (isLoaded && !isSignedIn) {
    return <div className="text-center text-[var(--textColor)] mt-8">You need to sign in to create a post!</div>;
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setCover({ file, previewUrl });
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] max-w-[900px] flex flex-col top-[20px] gap-6 px-4 py-6">
      <h1 className="text-3xl font-semibold text-[var(--textColor)]">Create a New Post</h1>
      {error && <div className="p-4 text-red-700 bg-red-100 rounded-lg">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1">
        <div>
          <Upload type="image" setProgress={setProgress} setData={setCover}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              ref={fileInputRef}
              id="coverImageInput"
            />
            <label
              htmlFor="coverImageInput"
              className="w-max p-3 shadow-md rounded-xl cursor-pointer"
            >
              {progress > 0 && progress < 100 ? "Uploading..." : "Add a cover image"}
            </label>
          </Upload>
        </div>
        {cover && cover.previewUrl && (
          <div className="relative w-full max-w-[250px] h-[150px] mx-auto">
            <img src={cover.previewUrl} className="w-full h-full object-cover rounded-md" />
            <button
              type="button"
              onClick={() => setCover(null)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
            >
              ✕
            </button>
          </div>
        )}
        <input type="text" placeholder="Title" value={title} onChange={handleTitleChange} className="p-3 w-full border rounded-xl" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="p-3 w-full border rounded-xl">
          <option value="">Select a category</option>
          <option value="general">General</option>
        </select>
        <ReactQuill value={desc} onChange={handleDescChange} placeholder="Description" className="border rounded-xl" />
        <input type="checkbox" id="isFeatured" checked={isFeatured} onChange={() => setIsFeatured(!isFeatured)} />
        <label htmlFor="isFeatured">Is this post featured?</label>
        <button disabled={mutation.isPending || (progress > 0 && progress < 100)} className="bg-blue-500 text-white p-3 rounded-xl">
          {mutation.isPending ? "Publishing..." : "Publish Post"}
        </button>
      </form>
    </div>
  );
};

export default Write;

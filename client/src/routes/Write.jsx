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

  const generateSlug = (title) => {
    return title
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-]/g, "") // Remove special characters
      .toLowerCase();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    clearError();

    if (!title) return setError("Please include a title for your post.");
    if (!desc) return setError("Please include a description for your post.");
    if (!category) return setError("Please select a category for your post.");
    if (!cover) return setError("Please upload a cover image for your post.");

    const timestamp = Date.now();
    const slug = `${generateSlug(title)}-${timestamp}`;

    const data = {
      img: cover.filePath,
      title,
      category,
      desc,
      slug,
      isFeatured,
      author: user?.fullName || "Anonymous",
    };

    mutation.mutate(data);
  };

  if (!isLoaded) {
    return <div className="text-center text-gray-600 mt-8">Loading...</div>;
  }

  if (isLoaded && !isSignedIn) {
    return <div className="text-center text-gray-600 mt-8">You need to sign in to create a post!</div>;
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setCover({ file, previewUrl });
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <h1 className="text-3xl font-semibold">Create a New Post</h1>
      {error && <div className="text-red-600 bg-red-100 p-2 rounded">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Upload type="image" setProgress={setProgress} setData={setCover}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            ref={fileInputRef}
            id="coverImageInput"
          />
          <label htmlFor="coverImageInput" className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded">
            {progress > 0 && progress < 100 ? "Uploading..." : "Add a cover image"}
          </label>
        </Upload>

        {cover && cover.previewUrl && (
          <div className="relative">
            <img src={cover.previewUrl} alt="Cover preview" className="w-40 h-24 object-cover rounded" />
            <button type="button" onClick={() => setCover(null)} className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 text-xs rounded">
              ✕
            </button>
          </div>
        )}

        <input
          type="text"
          placeholder="Enter Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded"
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border p-2 rounded">
          <option value="" disabled>Select a category</option>
          <option value="general">General</option>
        </select>

        <ReactQuill value={desc} onChange={setDesc} className="border rounded" placeholder="A Short Description" />

        <div className="flex items-center gap-2">
          <input type="checkbox" id="isFeatured" checked={isFeatured} onChange={() => setIsFeatured(!isFeatured)} />
          <label htmlFor="isFeatured">Is this post featured?</label>
        </div>

        <button
          disabled={mutation.isPending || (progress > 0 && progress < 100)}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {mutation.isPending ? "Publishing..." : "Publish Post"}
        </button>
      </form>
    </div>
  );
};

export default Write;

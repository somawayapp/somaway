// Updated Write Component
import React, { useState } from "react";
import axios from "axios";

const Write = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("General");
  const [cover, setCover] = useState(null); // For image upload and preview
  const [isFeatured, setIsFeatured] = useState(false); // For featured toggle

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setCover({ filePath: file.name, file, previewUrl });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !desc || !cover) {
      alert("Please fill in all fields and upload an image.");
      return;
    }

    // Upload image to server
    const formData = new FormData();
    formData.append("file", cover.file);

    try {
      const uploadResponse = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrl = uploadResponse.data.filePath;

      // Submit post data
      const data = {
        img: imageUrl,
        title,
        category,
        desc,
        slug: title.toLowerCase().replace(/\s+/g, "-").slice(0, 50), // Unique slug
        isFeatured, // Featured field
      };

      await axios.post("/api/posts", data);
      alert("Post submitted successfully!");
    } catch (error) {
      console.error("Error uploading post:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Create a New Post</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Title Input */}
        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded-md"
        />

        {/* Description Textarea */}
        <textarea
          placeholder="Write your post description here..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="w-full p-2 border rounded-md h-32"
        />

        {/* Category Selector */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="General">General</option>
          <option value="Tech">Tech</option>
          <option value="Health">Health</option>
          <option value="Science">Science</option>
        </select>

        {/* Image Upload */}
        <div className="relative w-full max-w-[250px] h-[150px] mb-4">
          {cover && cover.previewUrl ? (
            <img
              src={cover.previewUrl}
              alt="Cover preview"
              className="w-full h-full object-cover rounded-md shadow-lg"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
              <p className="text-gray-500">No Image Preview</p>
            </div>
          )}
          <input
            type="file"
            onChange={handleFileUpload}
            className="mt-2"
          />
        </div>

        {/* Featured Button */}
        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-700">Mark as Featured:</label>
          <button
            type="button"
            onClick={() => setIsFeatured((prev) => !prev)}
            className={`px-4 py-2 rounded-md shadow-md ${
              isFeatured ? "bg-green-500 text-white" : "bg-gray-300 text-black"
            }`}
          >
            {isFeatured ? "Yes (Featured)" : "No (Not Featured)"}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Publish Post
        </button>
      </form>
    </div>
  );
};

export default Write;

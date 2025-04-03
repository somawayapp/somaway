import { useState, useRef } from "react";
import { toast } from "react-toastify";

const authenticator = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/posts/upload-auth`
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

const Upload = ({ children, type, setData }) => {
  const inputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState({});

  const handleFileUpload = async (files) => {
    const { signature, expire, token } = await authenticator();

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("publicKey", import.meta.env.VITE_IK_PUBLIC_KEY);
      formData.append("signature", signature);
      formData.append("expire", expire);
      formData.append("token", token);

      try {
        const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload: ${file.name}`);
        }

        const data = await response.json();
        setData((prev) => [...prev, data]); // Store uploaded images
      } catch (error) {
        console.error("Upload error:", error);
        toast.error(`Upload failed for ${file.name}`);
      }
    }
  };

  return (
    <div>
      {/* Hidden File Input */}
      <input
        type="file"
        multiple
        accept={`${type}/*`}
        ref={inputRef}
        className="hidden"
        onChange={(e) => handleFileUpload(e.target.files)}
      />

      {/* Upload Button */}
      <div className="cursor-pointer" onClick={() => inputRef.current.click()}>
        {children}
      </div>
    </div>
  );
};

export default Upload;

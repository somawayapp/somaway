import { IKContext, IKUpload } from "imagekitio-react";
import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { Camera } from "lucide-react";

const authenticator = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/upload-auth`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    return { signature: data.signature, expire: data.expire, token: data.token };
  } catch (error) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

const Upload = ({ setProgress, setData }) => {
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files).slice(0, 10);
    const previewImages = files.map((file) => URL.createObjectURL(file));
    setImages(previewImages);
    uploadImages(files);
  };

  const handlePaste = (event) => {
    const files = Array.from(event.clipboardData.files).slice(0, 10);
    if (files.length > 0) {
      const previewImages = files.map((file) => URL.createObjectURL(file));
      setImages(previewImages);
      uploadImages(files);
    }
  };

  const handleCapture = () => {
    fileInputRef.current.click();
  };

  const uploadImages = (files) => {
    files.forEach((file) => {
      const formData = new FormData();
      formData.append("file", file);
      fetch(`${import.meta.env.VITE_API_URL}/posts/upload-auth`, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          setData((prev) => [...prev, data]);
        })
        .catch(() => {
          toast.error("Image upload failed!");
        });
    });
  };

  const handleDelete = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <IKContext
      publicKey={import.meta.env.VITE_IK_PUBLIC_KEY}
      urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
      authenticator={authenticator}
    >
      <div
        className="p-4 border-dashed border-2 border-gray-300 rounded-lg flex flex-wrap gap-2"
        onPaste={handlePaste}
      >
        {images.length < 10 && (
          <label className="cursor-pointer bg-gray-200 p-4 rounded-lg">
            <input type="file" multiple accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />
            📷 Upload or Paste Images
          </label>
        )}
        <button onClick={handleCapture} className="bg-blue-500 text-white p-2 rounded-lg">
          <Camera size={20} /> Capture
        </button>
      </div>

      {images.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {images.map((img, index) => (
            <div key={index} className="relative w-[100px] h-[100px]">
              <img src={img} alt="Preview" className="w-full h-full object-cover rounded-lg" />
              <button onClick={() => handleDelete(index)} className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded">X</button>
            </div>
          ))}
        </div>
      )}
    </IKContext>
  );
};

export default Upload;
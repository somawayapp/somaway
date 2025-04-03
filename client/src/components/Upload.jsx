import { IKContext, IKUpload } from "imagekitio-react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

// Authentication logic
const authenticator = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/upload-auth`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

const Upload = ({ setProgress, setData }) => {
  const ref = useRef(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle image errors
  const onError = (err) => {
    console.log(err);
    toast.error("Image upload failed!");
  };

  // Handle successful image upload
  const onSuccess = (res) => {
    console.log(res);
    setData((prev) => [...prev, res]); // Append new image to array
    setImages((prev) => [...prev, res]); // Update preview list
  };

  // Handle image upload progress
  const onUploadProgress = (progress) => {
    console.log(progress);
    setProgress(Math.round((progress.loaded / progress.total) * 100));
  };

  // Handle file input change (bulk selection)
  const handleFilesChange = (e) => {
    const files = e.target.files;
    if (files.length + images.length > 10) {
      toast.error("You can only upload a maximum of 10 images.");
      return;
    }

    const newImages = Array.from(files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  // Handle camera capture
  const handleCapture = async (e) => {
    const captureFile = e.target.files[0];
    if (captureFile) {
      const captureImage = {
        file: captureFile,
        url: URL.createObjectURL(captureFile),
      };
      setImages((prev) => [...prev, captureImage]);
    }
  };

  // Delete an image
  const deleteImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <IKContext
      publicKey={import.meta.env.VITE_IK_PUBLIC_KEY}
      urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
      authenticator={authenticator}
    >
      <div className="image-picker-container">
        <div className="flex flex-wrap gap-2">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image.url}
                alt="Uploaded"
                className="w-[100px] h-[100px] object-cover rounded-lg"
              />
              <button
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex justify-center items-center"
                onClick={() => deleteImage(index)}
              >
                X
              </button>
            </div>
          ))}
        </div>

        {/* File Input for Uploading Images */}
        <div className="flex gap-2 mt-4">
          <label
            htmlFor="image-upload"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg cursor-pointer"
          >
            Select Images
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesChange}
            className="hidden"
          />

          {/* Camera Capture */}
          <label
            htmlFor="camera-upload"
            className="bg-green-500 text-white py-2 px-4 rounded-lg cursor-pointer"
          >
            Capture Image
          </label>
          <input
            id="camera-upload"
            type="file"
            accept="image/*"
            capture="camera"
            onChange={handleCapture}
            className="hidden"
          />
        </div>

        <IKUpload
          useUniqueFileName
          onError={onError}
          onSuccess={onSuccess}
          onUploadProgress={onUploadProgress}
          className="hidden"
          ref={ref}
        />
      </div>
    </IKContext>
  );
};

export default Upload;


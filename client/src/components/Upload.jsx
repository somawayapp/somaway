import { IKContext, IKUpload } from "imagekitio-react";
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

const Upload = ({ children, type, setProgress, setData }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const ref = useRef(null);

  const onError = (err) => {
    console.log(err);
    toast.error("Image upload failed!");
  };

  const onSuccess = (res) => {
    console.log(res);
    setData((prev) => [...prev, res]); // Append new image to array
  };

  const onUploadProgress = (progress) => {
    console.log(progress);
    setProgress(Math.round((progress.loaded / progress.total) * 100));
  };

  const handleImageSelect = (e) => {
    const files = e.target.files;
    if (files.length + selectedImages.length > 10) {
      toast.error("You can only upload a maximum of 10 images.");
      return;
    }

    const newImages = [];
    const newPreviews = [];
    for (let i = 0; i < files.length; i++) {
      newImages.push(files[i]);
      const previewURL = URL.createObjectURL(files[i]);
      newPreviews.push(previewURL);
    }

    setSelectedImages((prev) => [...prev, ...newImages]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleDeleteImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCameraCapture = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        const video = document.createElement("video");
        video.srcObject = stream;
        video.play();
        video.onloadedmetadata = () => {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          canvas.getContext("2d").drawImage(video, 0, 0);
          const imgURL = canvas.toDataURL("image/png");

          setSelectedImages((prev) => [...prev, imgURL]);
          setImagePreviews((prev) => [...prev, imgURL]);
          stream.getTracks().forEach(track => track.stop());
        };
      })
      .catch((err) => {
        toast.error("Failed to access camera");
        console.error(err);
      });
  };

  return (
    <IKContext
      publicKey={import.meta.env.VITE_IK_PUBLIC_KEY}
      urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
      authenticator={authenticator}
    >
      <div className="upload-container">
        {/* Bulk Upload Button */}
        <div className="upload-buttons">
          <button
            onClick={() => ref.current.click()}
            className="upload-btn"
          >
            {children}
          </button>
          <button
            onClick={handleCameraCapture}
            className="camera-btn"
          >
            Use Camera
          </button>
        </div>

        {/* File input (hidden) */}
        <IKUpload
          useUniqueFileName
          onError={onError}
          onSuccess={onSuccess}
          onUploadProgress={onUploadProgress}
          className="hidden"
          ref={ref}
          accept={`${type}/*`}
          multiple
          onChange={handleImageSelect}
        />

        {/* Image Previews */}
        <div className="image-previews">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="image-preview">
              <img src={preview} alt={`Preview ${index}`} />
              <button
                className="delete-btn"
                onClick={() => handleDeleteImage(index)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* Max 10 Upload Button */}
        {selectedImages.length > 0 && selectedImages.length <= 10 && (
          <IKUpload
            useUniqueFileName
            onError={onError}
            onSuccess={onSuccess}
            onUploadProgress={onUploadProgress}
            className="hidden"
            ref={ref}
            accept={`${type}/*`}
            multiple
          />
        )}
      </div>
    </IKContext>
  );
};

export default Upload;

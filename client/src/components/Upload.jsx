import { IKContext, IKUpload } from "imagekitio-react";
import { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaTimes, FaCamera } from "react-icons/fa";

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
  const ref = useRef(null);
  const [previewImages, setPreviewImages] = useState([]);

  const handleFileSelect = (files) => {
    const imagePreviews = Array.from(files).map((file) => {
      return { file, url: URL.createObjectURL(file) };
    });
    setPreviewImages((prev) => [...prev, ...imagePreviews]);
  };

  const onError = (err) => {
    console.log(err);
    toast.error("Image upload failed!");
  };

  const onSuccess = (res) => {
    console.log(res);
    setData((prev) => [...prev, res]);
    setPreviewImages((prev) => prev.filter((img) => img.file.name !== res.name));
  };

  const onUploadProgress = (progress) => {
    console.log(progress);
    setProgress(Math.round((progress.loaded / progress.total) * 100));
  };

  const handlePaste = (event) => {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (const item of items) {
      if (item.kind === "file") {
        const file = item.getAsFile();
        handleFileSelect([file]);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, []);

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    handleFileSelect(event.dataTransfer.files);
  };

  const removePreview = (index) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <IKContext
      publicKey={import.meta.env.VITE_IK_PUBLIC_KEY}
      urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
      authenticator={authenticator}
    >
      <div
        className="p-4 border-2 border-dashed rounded-lg text-center cursor-pointer"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => ref.current.click()}
      >
        {children || "Drag & Drop or Click to Upload"}
      </div>
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
      <button
        className="mt-2 p-2 bg-blue-500 text-white rounded"
        onClick={() => ref.current.click()}
      >
        Select Images
      </button>
      <button
        className="mt-2 ml-2 p-2 bg-green-500 text-white rounded flex items-center"
        onClick={() => {
          navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
              const track = stream.getVideoTracks()[0];
              const imageCapture = new ImageCapture(track);
              imageCapture.takePhoto().then((blob) => {
                const file = new File([blob], "camera-image.jpg", { type: "image/jpeg" });
                handleFileSelect([file]);
                track.stop();
              });
            })
            .catch((err) => toast.error("Camera access denied!"));
        }}
      >
        <FaCamera className="mr-2" /> Take Photo
      </button>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {previewImages.map((img, index) => (
          <div key={index} className="relative group">
            <img
              src={img.url}
              alt="Preview"
              className="w-full h-24 object-cover rounded"
            />
            <button
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
              onClick={() => removePreview(index)}
            >
              <FaTimes />
            </button>
          </div>
        ))}
      </div>
    </IKContext>
  );
};

export default Upload;
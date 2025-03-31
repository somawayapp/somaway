import { IKContext, IKUpload } from "imagekitio-react";
import { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaTimes, FaCamera } from "react-icons/fa";

const MAX_IMAGES = 10;

const authenticator = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/posts/upload-auth`
    );
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

const Upload = ({ children, type, setProgress, setData }) => {
  const ref = useRef(null);
  const videoRef = useRef(null);
  const [previewImages, setPreviewImages] = useState([]);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [uploadQueue, setUploadQueue] = useState([]);

  const handleFileSelect = (files) => {
    let selectedFiles = Array.from(files).slice(0, MAX_IMAGES - previewImages.length);
    if (selectedFiles.length < files.length) {
      toast.warn(`Only ${MAX_IMAGES} images allowed!`);
    }
    const imagePreviews = selectedFiles.map((file) => ({ file, url: URL.createObjectURL(file) }));
    setPreviewImages((prev) => [...prev, ...imagePreviews]);
    setUploadQueue((prev) => [...prev, ...selectedFiles]);
  };

  const onError = () => toast.error("Image upload failed!");

  const onSuccess = (res) => {
    setData((prev) => [...prev, { url: res.url }]);
    setUploadQueue((prev) => prev.filter((file) => file.name !== res.name));
  };

  const onUploadProgress = (progress) => {
    setProgress(Math.round((progress.loaded / progress.total) * 100));
  };

  const handlePaste = (event) => {
    const items = event.clipboardData.items;
    const files = [];
    for (const item of items) {
      if (item.kind === "file") files.push(item.getAsFile());
    }
    handleFileSelect(files);
  };

  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, []);

  const removePreview = (index) => {
    const removedImage = previewImages[index];
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setUploadQueue((prev) => prev.filter((file) => file.name !== removedImage.file.name));
  };

  const openCamera = () => {
    setCameraOpen(true);
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(() => toast.error("Camera access denied!"));
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      const file = new File([blob], "captured-image.jpg", { type: "image/jpeg" });
      handleFileSelect([file]);
    });
    closeCamera();
  };

  const closeCamera = () => {
    setCameraOpen(false);
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <IKContext
      publicKey={import.meta.env.VITE_IK_PUBLIC_KEY}
      urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
      authenticator={authenticator}
    >
      <div
        className="p-4 border-2 border-dashed rounded-lg text-center cursor-pointer"
        onClick={() => ref.current.click()}
      >
        {children || "Drag & Drop or Click to Upload"}
      </div>
      <input
        type="file"
        multiple
        className="hidden"
        ref={ref}
        accept={`${type}/*`}
        onChange={(e) => {
          if (e.target.files) {
            handleFileSelect(e.target.files);
          }
        }}
      />
      <button className="mt-2 p-2 bg-blue-500 text-white rounded" onClick={() => ref.current.click()}>
        Select Images
      </button>
      <button className="mt-2 ml-2 p-2 bg-green-500 text-white rounded flex items-center" onClick={openCamera}>
        <FaCamera className="mr-2" /> Take Photo
      </button>
      {cameraOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-10 rounded-xl flex flex-col items-center justify-center">
          <video ref={videoRef} autoPlay className="w-full max-w-lg rounded" />
          <button className="mt-4 p-3 bg-white text-black rounded-full" onClick={capturePhoto}>
            Capture
          </button>
          <button className="mt-2 p-2 bg-red-500 text-white rounded" onClick={closeCamera}>
            Close
          </button>
        </div>
      )}
      <div className="mt-4 grid grid-cols-4 gap-2">
        {previewImages.map((img, index) => (
          <div key={index} className="relative group">
            <img src={img.url} alt="Preview" className="w-full h-24 object-cover rounded" />
            <button className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100" onClick={() => removePreview(index)}>
              <FaTimes />
            </button>
          </div>
        ))}
      </div>
      {uploadQueue.length > 0 && (
        <IKUpload
          useUniqueFileName
          onError={onError}
          onSuccess={onSuccess}
          onUploadProgress={onUploadProgress}
          className="hidden"
          files={uploadQueue}
        />
      )}
    </IKContext>
  );
};

export default Upload;
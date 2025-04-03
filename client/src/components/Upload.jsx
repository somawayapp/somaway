import { IKContext, IKUpload } from "imagekitio-react";
import { useRef, useState, useEffect, useCallback } from "react"; // Added useCallback
import { toast } from "react-toastify";
import { FaTimes, FaCamera, FaUpload } from "react-icons/fa"; // Added FaUpload

const MAX_IMAGES = 10;
const authenticator = async () => {
};


  const Upload = ({ children, type, setProgress, setData }) => {
    const ref = useRef(null);
   const fileInputRef = useRef(null); // Renamed ref for clarity
  const videoRef = useRef(null);
  const [previewImages, setPreviewImages] = useState([]); // Stores { file, localUrl } for preview
  const [cameraOpen, setCameraOpen] = useState(false);
  const [uploadQueue, setUploadQueue] = useState([]); // Files waiting to be uploaded by IKUpload

  const handleFileSelect = useCallback((files) => {
    const validFiles = Array.from(files).filter(file => file.type.startsWith(`${type}/`));

    if(validFiles.length !== files.length){
        toast.warn(`Some files were not of the expected type (${type}) and were ignored.`);
    }

    let selectedFiles = validFiles.slice(
      0,
      MAX_IMAGES - previewImages.length
    );

    if (selectedFiles.length < validFiles.length) {
      toast.warn(`You can only upload a maximum of ${MAX_IMAGES} images.`);
    }

    if (selectedFiles.length === 0) {
        if(validFiles.length > 0) toast.info("Maximum image limit reached."); // Inform if limit stopped additions
        return; // No new valid files to add
    }

    const newImagePreviews = selectedFiles.map((file) => ({
      file,
      localUrl: URL.createObjectURL(file), // Use localUrl for clarity
      name: file.name // Store name for removal logic
    }));

    setPreviewImages((prev) => [...prev, ...newImagePreviews]);
    setUploadQueue((prev) => [...prev, ...selectedFiles]); // Add files to the upload queue

    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }

  }, [previewImages.length, type]); // Depend on preview length to enforce MAX_IMAGES correctly


  const onError = (err) => {
    console.error("Upload Error:", err);
    const message = err?.message || "Image upload failed! Please try again.";
    toast.error(message);

    setProgress(0); // Reset progress on error
  };

 

  const onSuccess = (res) => {
    console.log(res);
    setData((prev) => [...prev, res]); // Append new image to array
  };

  const onUploadProgress = (progress) => {
    console.log(progress);
    setProgress(Math.round((progress.loaded / progress.total) * 100));
  };




  const handlePaste = useCallback((event) => {
    const items = event.clipboardData.items;
    const files = [];
    for (const item of items) {
      if (item.kind === "file" && item.type.startsWith(`${type}/`)) {
        const file = item.getAsFile();
        if (file) files.push(file);
      }
    }
    if (files.length > 0) {
        handleFileSelect(files);
    }
  }, [handleFileSelect, type]); // Include dependencies


  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [handlePaste]); // Dependency array includes the memoized handler


  const removePreview = (indexToRemove) => {
     const removedImagePreview = previewImages[indexToRemove];

     setPreviewImages((prev) => prev.filter((_, i) => i !== indexToRemove));

     setUploadQueue((prevQueue) => prevQueue.filter((file) => file.name !== removedImagePreview.name));

     URL.revokeObjectURL(removedImagePreview.localUrl);
  };

  const openCamera = async () => {
     if (previewImages.length >= MAX_IMAGES) {
        toast.warn(`Maximum ${MAX_IMAGES} images allowed.`);
        return;
     }
     setCameraOpen(true);
     try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
     } catch (err) {
        console.error("Camera access error:", err);
        toast.error("Camera access denied or not available!");
        setCameraOpen(false);
     }
  };


  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || !video.srcObject) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        toast.error("Failed to get canvas context");
        return;
    }
    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        const fileName = `captured-${Date.now()}.jpg`;
        const file = new File([blob], fileName, { type: "image/jpeg" });
        handleFileSelect([file]); // Use the existing handler
      } else {
        toast.error("Failed to capture image.");
      }
      closeCamera(); // Close camera after capture attempt
    }, "image/jpeg"); // Specify blob type
  };

  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop()); // Stop camera stream
      videoRef.current.srcObject = null; // Release the source object
    }
    setCameraOpen(false);
  };

  useEffect(() => {
      return () => {
          previewImages.forEach(img => URL.revokeObjectURL(img.localUrl));
      };
  }, [previewImages]);


  return (
    <IKContext
    publicKey={import.meta.env.VITE_IK_PUBLIC_KEY}
    urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
    authenticator={authenticator}
  >
      {/* Clickable Area for Upload */}
      <div
        className="p-4 border-2 border-dashed border-[var(--softBg4)] rounded-lg text-center cursor-pointer hover:bg-[var(--softBg2)] transition-colors"
        onClick={() => fileInputRef.current?.click()} // Trigger hidden input
        role="button" // Accessibility
        tabIndex={0} // Accessibility
        onKeyPress={(e) => { if (e.key === 'Enter') fileInputRef.current?.click(); }} // Accessibility
      >
         <FaUpload className="mx-auto mb-2 text-xl text-[var(--softTextColor)]"/>
        {previewImages.length === 0
          ? "Click or Drag & Drop Images Here"
          : `Add more images (${previewImages.length}/${MAX_IMAGES})`}
          <span className="block text-xs text-[var(--softTextColor)]">(Or paste images)</span>
      </div>

      <input
        type="file"
        multiple
        className="hidden"
        ref={fileInputRef}
        accept={`${type}/*`} // Use type prop dynamically
        onChange={(e) => {
          if (e.target.files) {
            handleFileSelect(e.target.files);
          }
        }}
      />

      <div className="flex gap-2 mt-2">
        <button
          type="button" // *** IMPORTANT: Prevents form submission ***
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
          onClick={() => fileInputRef.current?.click()}
          disabled={previewImages.length >= MAX_IMAGES}
        >
          Select Files
        </button>
        <button
          type="button" // *** IMPORTANT: Prevents form submission ***
          className="p-2 bg-green-500 text-white rounded flex items-center hover:bg-green-600 transition-colors disabled:opacity-50"
          onClick={openCamera}
          disabled={previewImages.length >= MAX_IMAGES}
        >
          <FaCamera className="mr-1" /> Take Photo
        </button>
      </div>


      {/* Camera Modal */}
      {cameraOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex flex-col items-center justify-center p-4">
          <video ref={videoRef} autoPlay playsInline className="w-full max-w-lg rounded border border-gray-500 mb-4" />
          <div className="flex gap-4">
            <button
                type="button" // *** IMPORTANT ***
                className="p-3 bg-white text-black rounded-full text-lg font-semibold hover:bg-gray-200 transition-colors" onClick={capturePhoto}>
              Capture
            </button>
            <button
                type="button" // *** IMPORTANT ***
                className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors" onClick={closeCamera}>
              Close Camera
            </button>
          </div>
        </div>
      )}


      {/* Image Previews Grid */}
      {previewImages.length > 0 && (
          <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
          {previewImages.map((img, index) => (
            <div key={index} className="relative group aspect-square"> {/* Use aspect-square for consistent shape */}
              <img
                src={img.localUrl} // Use the local object URL for preview
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover rounded border border-[var(--softBg4)]"
              />
              <button
                type="button" // *** IMPORTANT ***
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-70 group-hover:opacity-100 transition-opacity focus:opacity-100"
                onClick={() => removePreview(index)}
                aria-label="Remove image"
              >
                <FaTimes size={12}/>
              </button>
            </div>
          ))}
        </div>
      )}


          <IKUpload
          useUniqueFileName
          onError={onError}
          onSuccess={onSuccess}
          onUploadProgress={onUploadProgress}
          className="hidden"
          ref={ref}
          accept={`${type}/*`}
          multiple // Allow multiple uploads
        />
        <div className="cursor-pointer" onClick={() => ref.current.click()}>
          {children} 
          </div>
       
    
    </IKContext>
  );
};

export default Upload;
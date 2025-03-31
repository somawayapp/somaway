import { IKContext, IKUpload } from "imagekitio-react";
import { useRef, useState, useEffect, useCallback } from "react"; // Added useCallback
import { toast } from "react-toastify";
import { FaTimes, FaCamera, FaUpload } from "react-icons/fa"; // Added FaUpload

const MAX_IMAGES = 10;

// Define authenticator outside component or use useCallback if it depends on props/state
const authenticator = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/posts/upload-auth` // Ensure this endpoint is correct and returns expected token/signature/expire
    );
    if (!response.ok) {
      const errorBody = await response.text(); // Read body for more details
      console.error("Authentication request failed body:", errorBody);
      throw new Error(`Request failed with status ${response.status}`);
    }
    const data = await response.json();
    if (!data.signature || !data.expire || !data.token) {
       console.error("Authentication response missing required fields:", data);
       throw new Error('Authentication response missing required fields.');
    }
    return data;
  } catch (error) {
     console.error("Authentication request failed:", error);
    // Provide a more specific error message to the user if possible
    toast.error(`Image upload authentication failed: ${error.message}`);
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};


const Upload = ({ type = "image", setProgress, setData }) => {
  const fileInputRef = useRef(null); // Renamed ref to be more specific
  const videoRef = useRef(null);
  const [previewImages, setPreviewImages] = useState([]); // Stores { file, localUrl } for preview
  const [cameraOpen, setCameraOpen] = useState(false);
  // uploadQueue stores File objects that NEED to be uploaded by IKUpload
  const [uploadQueue, setUploadQueue] = useState([]);
  // Keep track of successfully uploaded ImageKit URLs to prevent duplicates if setData is complex
  const [uploadedUrls, setUploadedUrls] = useState(new Set());

  // Callback to handle file selection from input, drag/drop, paste, camera
  const handleFileSelect = useCallback((files) => {
    const validFiles = Array.from(files).filter(file => file.type.startsWith(`${type}/`));

    if (validFiles.length !== files.length) {
        toast.warn(`Some files were not valid ${type}s.`);
    }

    const currentImageCount = previewImages.length;
    const availableSlots = MAX_IMAGES - currentImageCount;

    if (availableSlots <= 0) {
        toast.warn(`You can only upload a maximum of ${MAX_IMAGES} images.`);
        return;
    }

    let filesToAdd = validFiles.slice(0, availableSlots);

    if (filesToAdd.length < validFiles.length) {
      toast.warn(`Limit reached. Only ${filesToAdd.length} out of ${validFiles.length} images were added.`);
    }

    // Filter out files that might already be in the queue or preview (basic name check)
    filesToAdd = filesToAdd.filter(file =>
        !previewImages.some(p => p.file.name === file.name) &&
        !uploadQueue.some(q => q.name === file.name)
    );

    if (filesToAdd.length === 0) return; // No new valid files to add

    // Create previews
    const imagePreviews = filesToAdd.map((file) => ({
      file,
      localUrl: URL.createObjectURL(file), // Local URL for immediate preview
    }));

    setPreviewImages((prev) => [...prev, ...imagePreviews]);
    // Add the actual File objects to the queue for IKUpload to process
    setUploadQueue((prev) => [...prev, ...filesToAdd]);

  }, [previewImages, uploadQueue, type]); // Added dependencies

  // ImageKit Upload Callbacks
  const onError = (err) => {
     console.error("Image upload error:", err);
    // Attempt to remove the failed file from the queue if possible (might need more robust tracking)
    // This part is tricky as IKUpload might not give specific file info on error easily
    toast.error(`Image upload failed! ${err?.message || ''}`);
    // Optionally reset progress if a file fails
    // setProgress(0);
  };

  const onSuccess = (res) => {
    // res contains the ImageKit response, including the URL
    // Check if this URL has already been added to prevent duplicates from potential retries/race conditions
    if (!uploadedUrls.has(res.url)) {
        setData((prevData) => [...prevData, { url: res.url }]); // Update parent state with the actual ImageKit URL
        setUploadedUrls(prev => new Set(prev).add(res.url)); // Track added URL
    }
    // Remove the successfully uploaded file from the queue *after* updating parent state
     setUploadQueue((prevQueue) => prevQueue.filter((file) => file.name !== res.name)); // Use res.name if available and matches original file name
     // If res.name isn't reliable, might need a more complex tracking mechanism
     toast.info(`Image "${res.name}" uploaded successfully.`);
  };

   // Debounce or throttle progress updates if they become too frequent
  const onUploadProgress = (progressData) => {
      // Calculate overall progress if IKUpload provides cumulative data, or just use latest file's progress
      const currentProgress = Math.round((progressData.loaded / progressData.total) * 100);
      setProgress(currentProgress);
  };

  // Effect to trigger upload when queue changes and component is mounted
  useEffect(() => {
    // This effect primarily ensures that if files are added programmatically,
    // the IKUpload component (which reacts to the 'files' prop) handles them.
    // Reset progress when queue becomes empty after uploads
    if (uploadQueue.length === 0) {
        setProgress(0);
    }
  }, [uploadQueue, setProgress]);


  // Paste Handling
  const handlePaste = useCallback((event) => {
    const items = event.clipboardData?.items;
    if (!items) return;
    const files = [];
    for (const item of items) {
      if (item.kind === "file" && item.type.startsWith(`${type}/`)) {
        const file = item.getAsFile();
        if (file) files.push(file);
      }
    }
    if (files.length > 0) {
       event.preventDefault(); // Prevent pasting file path as text
      handleFileSelect(files);
    }
  }, [handleFileSelect, type]); // Added dependencies

  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [handlePaste]); // Added dependency

  // Remove Image Preview and potentially from Upload Queue
  const removePreview = (indexToRemove) => {
    const removedImage = previewImages[indexToRemove];
    if (!removedImage) return;

    // Revoke the local object URL to free memory
    URL.revokeObjectURL(removedImage.localUrl);

    // Remove from preview state
    setPreviewImages((prev) => prev.filter((_, i) => i !== indexToRemove));

    // Remove the corresponding file from the upload queue if it's still there
    setUploadQueue((prevQueue) => prevQueue.filter((file) => file.name !== removedImage.file.name));

    // If the image was already uploaded, remove from parent state and tracked URLs
     // Note: This requires more complex logic, potentially passing 'img' state down or a remove callback
     // For simplicity here, we only handle removal before/during upload.
     // To handle removal *after* upload, you'd need to call a function passed from the parent
     // that updates the parent's 'img' state and 'uploadedUrls' here.
     if (uploadedUrls.has(removedImage.file.name)) { // Hypothetical check - needs better link between preview and uploaded URL
        console.warn("Cannot easily remove already uploaded image from parent state in this setup.");
        // Call a hypothetical function like: handleRemoveUploaded(removedImage.file.name or associated URL)
     }

  };

  // Camera Functions
  const openCamera = async () => {
     if (previewImages.length >= MAX_IMAGES) {
        toast.warn(`You have already reached the maximum of ${MAX_IMAGES} images.`);
        return;
     }
    setCameraOpen(true);
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
    } catch(err) {
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
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `captured-${timestamp}.jpg`;
        const file = new File([blob], fileName, { type: "image/jpeg" });
        handleFileSelect([file]); // Add captured photo as a file
      } else {
          toast.error("Failed to capture image from camera.");
      }
      closeCamera(); // Close camera after capture attempt
    }, "image/jpeg");
  };
  

};

export default Upload;
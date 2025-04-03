import { IKContext, IKUpload } from "imagekitio-react";
import { useRef, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify"; // Assuming you have react-toastify installed and configured
import { FaTimes, FaCamera, FaUpload } from "react-icons/fa"; // Assuming you have react-icons installed

const MAX_IMAGES = 10;

// --- Authenticator Function ---
// !! IMPORTANT !!: Make sure this function correctly fetches
// your authentication signature, token, and expire time from your backend.
// The backend endpoint '/posts/upload-auth' must exist and return the correct JSON structure.
const authenticator = async () => {
  console.log("DEBUG: Calling authenticator function..."); // Debug Log
  try {
    const response = await fetch(
      // Replace with your actual API endpoint URL
      // `${import.meta.env.VITE_API_URL}/posts/upload-auth`
      '/api/upload-auth' // Example endpoint - ADJUST THIS
    );

     console.log("DEBUG: Authenticator fetch response status:", response.status); // Debug Log

    if (!response.ok) {
      const errorText = await response.text();
      console.error("DEBUG: Authenticator response error text:", errorText); // Debug Log
      throw new Error(
        `Authentication request failed with status ${response.status}: ${errorText}`
      );
    }
    const data = await response.json();
    console.log("DEBUG: Authenticator response data:", data); // Debug Log

    if (!data.signature || !data.token || !data.expire) {
         console.error("DEBUG: Authentication response missing required fields.", data); // Debug Log
      throw new Error("Authentication response missing required fields.");
    }
    // Add a small buffer (e.g., 60 seconds) to the expiry time received from the server
    // This helps avoid issues where the token expires just before the upload request is made.
    // data.expire = data.expire - 60; // Or adjust calculation based on your server time
    return data;
  } catch (error) {
      console.error("DEBUG: Authentication request failed:", error); // Debug Log
      // Throw a more specific error to be caught by IKUpload onError
      throw new Error(`Authentication failed: ${error.message}`);
  }
};


// --- Upload Component ---
const Upload = ({ type = "image", setProgress, setData }) => {
  // --- Refs ---
  const ikUploadRef = useRef(null); // Ref for IKUpload component (though less used in file-prop mode)
  const fileInputRef = useRef(null); // Ref for the separate hidden HTML input
  const videoRef = useRef(null); // Ref for camera video element

  // --- State ---
  // Stores preview info: { file: File | null, localUrl: string, name: string, status: 'pending' | 'uploading' | 'success' | 'error', fileId?: string, url?: string }
  const [previewImages, setPreviewImages] = useState([]);
  const [cameraOpen, setCameraOpen] = useState(false);
  // State to manage the *single* file currently being uploaded by IKUpload via the 'file' prop
  const [fileToUpload, setFileToUpload] = useState(null);
  // Queue for files added via Paste/Camera/Button that need manual triggering one by one
  const [manualQueue, setManualQueue] = useState([]);

  // --- Debug Effect for fileToUpload state changes ---
  useEffect(() => {
    console.log("DEBUG: fileToUpload state updated:", fileToUpload); // Debug Log
  }, [fileToUpload]);

  // --- Function to add files to preview state ---
  const addFilesForPreview = useCallback((filesToAdd) => {
    const validFiles = Array.from(filesToAdd).filter(file => file.type.startsWith(`${type}/`));

    if (validFiles.length !== filesToAdd.length) {
      toast.warn(`Some files were not of the expected type (${type}) and were ignored.`);
    }

    let currentPreviewCount = previewImages.length;
    let allowedToAdd = MAX_IMAGES - currentPreviewCount;

    let selectedFiles = validFiles.slice(0, allowedToAdd);

    if (selectedFiles.length < validFiles.length && allowedToAdd > 0) {
      toast.warn(`You can only upload a maximum of ${MAX_IMAGES} images.`);
    } else if (validFiles.length > 0 && allowedToAdd <= 0) {
       toast.info("Maximum image limit reached.");
    }


    if (selectedFiles.length === 0) {
        return []; // Return empty array if no files added
    }

    const newImagePreviews = selectedFiles.map((file) => ({
      file, // Keep the file object for upload
      localUrl: URL.createObjectURL(file),
      name: file.name,
      status: 'pending', // Initial status
    }));

    setPreviewImages((prev) => [...prev, ...newImagePreviews]);
    return selectedFiles; // Return the files that were actually added to preview

  }, [previewImages.length, type]);

  // --- Handler to queue files for manual upload ---
  const enqueueManualUpload = useCallback((files) => {
      const addedFiles = addFilesForPreview(files); // Add previews first
      if (addedFiles.length > 0) {
          console.log("DEBUG: Adding to manualQueue:", addedFiles.map(f => f.name)); // Debug Log
          setManualQueue(prev => [...prev, ...addedFiles]); // Add the actual files to the manual queue
      }
      // Reset file input ref value if it was used
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
  }, [addFilesForPreview]);


  // --- Effect to process the manual queue one by one ---
  useEffect(() => {
      console.log("DEBUG: Queue Effect Check: fileToUpload=", fileToUpload, "manualQueue.length=", manualQueue.length); // Debug Log
      if (!fileToUpload && manualQueue.length > 0) {
          const nextFile = manualQueue[0];
          console.log("DEBUG: Dequeuing and setting fileToUpload:", nextFile.name, nextFile.size, nextFile.type); // Debug Log
          setManualQueue(prev => prev.slice(1)); // Remove from queue *before* setting fileToUpload
          setFileToUpload(nextFile); // Trigger upload via file prop change

          // Update preview status immediately when attempting upload
          setPreviewImages(prev => prev.map(p =>
              (p.name === nextFile.name && p.localUrl === URL.createObjectURL(nextFile)) // Match name and ensure it's the same preview instance
               ? { ...p, status: 'uploading' }
               : p
          ));
      }
  }, [manualQueue, fileToUpload]); // Dependencies: re-run when queue changes or upload finishes (fileToUpload becomes null)


  // --- IKUpload Callbacks ---
  const onError = (err, details) => {
    console.log("DEBUG: onError Fired:", err, details); // Debug Log (Log the raw error)
    const failedFileName = fileToUpload?.name || details?.file?.name || "Unknown file"; // Try to get name reliably
    console.error(`Upload Error for ${failedFileName}:`, err); // Log detailed error
    toast.error(`Upload failed for ${failedFileName}. ${err?.message || "Check console."}`);

    // Update preview status for the failed file
    setPreviewImages(prev => prev.map(p =>
      p.name === failedFileName && p.status === 'uploading'
       ? { ...p, status: 'error' }
       : p
    ));

    setProgress(0); // Reset progress bar
    // Only clear fileToUpload if the error corresponds to the currently assigned file
    if (fileToUpload && fileToUpload.name === failedFileName) {
      setFileToUpload(null); // Clear current upload slot to allow next manual item or retry
    }
  };

  const onSuccess = (res) => {
    console.log("DEBUG: onSuccess Fired:", res); // Debug Log (Log the raw success response)
    const successfulFileName = fileToUpload?.name || res.name; // Get name from state if possible, fallback to response

    setData((prev) => [...prev, { url: res.url, fileId: res.fileId }]); // Update parent state

     // Update preview status for the successful file
    setPreviewImages(prev => prev.map(p =>
       p.name === successfulFileName && p.status === 'uploading'
        ? { ...p, status: 'success', url: res.url, fileId: res.fileId, file: null } // Clear file object on success? Optional.
        : p
    ));

    setProgress(0); // Reset progress bar for next upload
    // Clear the fileToUpload slot *only if* it matches the successful file
    if (fileToUpload && fileToUpload.name === successfulFileName) {
       setFileToUpload(null); // Allow next item in manual queue to be processed
    }
  };

  const onUploadProgress = (progress) => {
    console.log("DEBUG: onUploadProgress Fired:", progress); // Debug Log progress data
    // Calculate percentage based on loaded and total
    const percentage = progress.total > 0 ? Math.round((progress.loaded / progress.total) * 100) : 0;
    setProgress(percentage);
    // Note: This progress is for the *current* single file upload.
    // You might want a different state/logic for overall progress if multiple files are queued.
  };

  // --- Paste Handler ---
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
      console.log("DEBUG: Pasted files detected:", files.map(f=>f.name)); // Debug Log
      enqueueManualUpload(files); // Use the manual queue for pasted files
    }
  }, [enqueueManualUpload, type]); // Include dependencies

  // --- Effect for Paste Listener ---
  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [handlePaste]); // Dependency array includes the memoized handler


  // --- Remove Preview Handler ---
  const removePreview = (indexToRemove) => {
    const removedImagePreview = previewImages[indexToRemove];
    if (!removedImagePreview) return;

    console.log("DEBUG: Removing preview for:", removedImagePreview.name); // Debug Log

    // TODO: Implement cancellation if possible using ImageKit SDK if the file is 'uploading'
    // This usually requires accessing the underlying XHR object, which might be exposed in onError/onProgress details.
    // Example pseudo-code: if (removedImagePreview.status === 'uploading' && ikUploadRef.current?.abort) { ikUploadRef.current.abort(...); }

    // Revoke the local URL first
    URL.revokeObjectURL(removedImagePreview.localUrl);

    // Update preview state
    setPreviewImages((prev) => prev.filter((_, i) => i !== indexToRemove));

    // If the removed file was the one *currently* set to upload, clear it to stop the attempt (if not already started) or allow next
    if (fileToUpload && fileToUpload.name === removedImagePreview.name) {
        console.log("DEBUG: Removed file was the current fileToUpload. Clearing."); // Debug Log
        setFileToUpload(null);
        // We might need to manually abort the request if IKUpload doesn't do it automatically when 'file' becomes null.
        // This depends heavily on imagekitio-react's behavior. Check network tab.
    }
    // Remove from manual queue as well if it's still pending there
    setManualQueue(prev => prev.filter(file => file.name !== removedImagePreview.name));

  };

  // --- Camera Handlers ---
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
    if (!video || !video.srcObject || !video.videoWidth) {
       console.warn("DEBUG: Video element not ready for capture."); // Debug Log
       toast.info("Camera not ready yet, please wait a moment.")
       return;
    };

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        toast.error("Failed to get canvas context");
       console.error("DEBUG: Failed to get canvas 2D context."); // Debug Log
        return;
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const fileName = `captured-${Date.now()}.jpg`;
        const file = new File([blob], fileName, { type: "image/jpeg" });
        console.log("DEBUG: Captured photo as file:", file.name, file.size); // Debug Log
        enqueueManualUpload([file]); // Use the manual queue for captured photos
      } else {
        toast.error("Failed to capture image (blob creation failed).");
        console.error("DEBUG: Canvas toBlob failed to create blob."); // Debug Log
      }
      closeCamera(); // Close camera after capture attempt
    }, "image/jpeg"); // Specify blob type
  };

  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop()); // Stop camera stream
      videoRef.current.srcObject = null; // Release the source object
      console.log("DEBUG: Camera stream stopped."); // Debug Log
    }
    setCameraOpen(false);
  };

  // --- Cleanup Effect for Object URLs ---
  useEffect(() => {
    // This runs when the component unmounts
    return () => {
        console.log("DEBUG: Component unmounting. Revoking Object URLs."); // Debug Log
        previewImages.forEach(img => {
            if (img.localUrl) { // Check if URL exists
                 URL.revokeObjectURL(img.localUrl)
            }
        });
        // Also ensure camera is closed if component unmounts while it's open
        if (cameraOpen) {
            closeCamera();
        }
     };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewImages, cameraOpen]); // Add cameraOpen dependency


  // --- Render Logic ---
  console.log("DEBUG: Rendering Upload component. fileToUpload=", fileToUpload?.name); // Debug Log on every render

  return (
    <IKContext
      // !! IMPORTANT !!: Replace with your actual ImageKit Public Key
      publicKey={import.meta.env.VITE_IK_PUBLIC_KEY || "your_public_key"}
      // !! IMPORTANT !!: Replace with your actual ImageKit URL Endpoint
      urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT || "https://ik.imagekit.io/your_account"}
      authenticator={authenticator}
    >
      {/* This IKUpload handles uploads triggered manually via the 'file' prop */}
      {/* It's hidden and uploads one file at a time when fileToUpload changes */}
      <IKUpload
        useUniqueFileName={true} // Recommended for avoiding name conflicts
        onError={onError}
        onSuccess={onSuccess}
        onUploadProgress={onUploadProgress}
        className="hidden" // Keep it hidden as UI is handled separately
        file={fileToUpload} // Upload triggered when this prop gets a File object
        fileName={fileToUpload?.name} // Provide filename when using file prop
        key={fileToUpload ? `${fileToUpload.name}-${fileToUpload.lastModified}` : 'idle'} // More robust key to force re-render/trigger
        ref={ikUploadRef} // Assign ref (might be useful for future SDK methods like abort)
        // folder={"/user_uploads"} // Optional: specify an upload folder
        // tags={["tag1", "tag2"]} // Optional: add tags
        // responseFields={["tags", "metadata"]} // Optional: request extra fields in response
      />

       {/* Hidden HTML file input triggered by buttons/clickable area */}
       <input
           type="file"
           multiple // Allow selecting multiple files at once
           className="hidden"
           ref={fileInputRef}
           accept={`${type}/*`} // Use type prop dynamically
           onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                    console.log("DEBUG: Files selected via HTML input:", Array.from(e.target.files).map(f=>f.name)); // Debug Log
                    enqueueManualUpload(Array.from(e.target.files));
                } else {
                    console.log("DEBUG: HTML input onChange triggered but no files selected."); // Debug Log
                }
           }}
       />

      {/* Clickable Area for Upload Trigger */}
      {/* Consider adding Drag & Drop handlers here if desired */}
      <div
          className="p-4 border-2 border-dashed border-[var(--softBg4)] rounded-lg text-center cursor-pointer hover:bg-[var(--softBg2)] transition-colors"
          onClick={() => fileInputRef.current?.click()} // Trigger hidden HTML input
          role="button" // Accessibility
          tabIndex={0} // Accessibility
          onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }} // Accessibility
      >
          <FaUpload className="mx-auto mb-2 text-xl text-[var(--softTextColor)]"/>
          {previewImages.length === 0
            ? `Click or Drag & Drop ${type === 'image' ? 'Images' : 'Files'} Here`
            : `Add more (${previewImages.length}/${MAX_IMAGES})`}
            <span className="block text-xs text-[var(--softTextColor)] mt-1">(Or paste {type === 'image' ? 'images' : 'content'})</span>
       </div>


      {/* Action Buttons */}
      <div className="flex gap-2 mt-2">
         <button
             type="button" // Prevent form submission
             className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
             onClick={() => fileInputRef.current?.click()} // Trigger the hidden input
             disabled={previewImages.length >= MAX_IMAGES || !!fileToUpload} // Disable if max reached OR an upload is in progress
         >
             Select Files
         </button>
         {type === 'image' && ( // Only show camera button for image type
             <button
                 type="button" // Prevent form submission
                 className="p-2 bg-green-500 text-white rounded flex items-center hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                 onClick={openCamera}
                 disabled={previewImages.length >= MAX_IMAGES || !!fileToUpload} // Disable if max reached OR an upload is in progress
              >
                 <FaCamera className="mr-1" /> Take Photo
             </button>
         )}
      </div>

      {/* Camera Modal */}
      {cameraOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex flex-col items-center justify-center p-4">
           <video ref={videoRef} autoPlay playsInline className="w-full max-w-lg rounded border border-gray-500 mb-4 bg-black" />
           <div className="flex gap-4">
             <button
                 type="button" // IMPORTANT
                 className="p-3 bg-white text-black rounded-full text-lg font-semibold hover:bg-gray-200 transition-colors"
                 onClick={capturePhoto}>
               Capture
             </button>
             <button
                 type="button" // IMPORTANT
                 className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors px-4 py-3"
                 onClick={closeCamera}>
               Close Camera
             </button>
           </div>
        </div>
      )}


      {/* Image Previews Grid */}
      {previewImages.length > 0 && (
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {previewImages.map((img, index) => (
            <div key={`${img.name}-${index}-${img.localUrl}`} className="relative group aspect-square"> {/* Slightly more robust key */}
              <img
                src={img.localUrl} // Use the local object URL for preview
                alt={`Preview ${img.name}`}
                className={`w-full h-full object-cover rounded border ${
                    img.status === 'uploading' ? 'opacity-40 animate-pulse' : '' // Visual feedback for uploading
                  } ${
                    img.status === 'error' ? 'border-red-500 border-2' : 'border-[var(--softBg4)]' // Visual feedback for error
                  } ${
                    img.status === 'success' ? 'border-green-500 border-2' : '' // Visual feedback for success
                  }`}
              />
              {/* Status Indicators */}
              {img.status === 'uploading' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 text-white text-xs font-semibold rounded">
                    Uploading...
                </div>
              )}
               {img.status === 'error' && (
                 <div className="absolute inset-0 flex items-center justify-center bg-red-800 bg-opacity-60 text-white text-xs font-semibold p-1 text-center rounded">
                     Upload Failed
                 </div>
               )}
               {img.status === 'success' && (
                 <div className="absolute top-0 left-0 bg-green-600 text-white p-1 rounded-br-md opacity-80">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                     </svg>
                 </div>
               )}

              {/* Remove Button */}
              <button
                type="button" // Prevent form submission
                className={`absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-70 group-hover:opacity-100 transition-opacity focus:opacity-100 ${
                    img.status === 'uploading' ? 'hidden' : '' // Hide remove button during upload? Your choice.
                }`}
                onClick={() => removePreview(index)}
                aria-label={`Remove ${img.name}`}
                // disabled={img.status === 'uploading'} // Alternative: disable instead of hiding
              >
                <FaTimes size={12}/>
              </button>
            </div>
          ))}
        </div>
      )}
    </IKContext>
  );
};

export default Upload;
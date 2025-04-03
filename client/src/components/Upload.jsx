import { IKContext, IKUpload } from "imagekitio-react";
import { useRef, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { FaTimes, FaCamera, FaUpload } from "react-icons/fa";

const MAX_IMAGES = 10;

// Authenticator remains the same...
const authenticator = async () => {
  // ... (keep existing implementation)
};


// --- Upload Component ---
const Upload = ({ type = "image", setProgress, setData }) => {
  const ikUploadRef = useRef(null); // Ref for IKUpload component
  const fileInputRef = useRef(null); // Ref for the separate hidden input (still useful for button click)
  const videoRef = useRef(null);
  const [previewImages, setPreviewImages] = useState([]); // Stores { file: File | null, localUrl: string, name: string, status: 'pending' | 'uploading' | 'success' | 'error', fileId?: string, url?: string }
  const [cameraOpen, setCameraOpen] = useState(false);

  // State to manage the *single* file currently being uploaded by IKUpload via the `file` prop
  const [fileToUpload, setFileToUpload] = useState(null);
  // Queue for files added via Paste/Camera that need manual triggering
  const [manualQueue, setManualQueue] = useState([]);

  // Function to add files to preview and potentially the manual queue
  const addFilesForPreview = useCallback((filesToAdd) => {
    const validFiles = Array.from(filesToAdd).filter(file => file.type.startsWith(`${type}/`));

    if (validFiles.length !== filesToAdd.length) {
      toast.warn(`Some files were not of the expected type (${type}) and were ignored.`);
    }

    let currentPreviewCount = previewImages.length;
    let allowedToAdd = MAX_IMAGES - currentPreviewCount;

    let selectedFiles = validFiles.slice(0, allowedToAdd);

    if (selectedFiles.length < validFiles.length) {
      toast.warn(`You can only upload a maximum of ${MAX_IMAGES} images.`);
    }

    if (selectedFiles.length === 0) {
        if (validFiles.length > 0) toast.info("Maximum image limit reached.");
        return []; // Return empty array if no files added
    }

    const newImagePreviews = selectedFiles.map((file) => ({
      file, // Keep the file object for potential upload
      localUrl: URL.createObjectURL(file),
      name: file.name,
      status: 'pending', // Initial status
    }));

    setPreviewImages((prev) => [...prev, ...newImagePreviews]);
    return selectedFiles; // Return the files that were actually added to preview

  }, [previewImages.length, type]);


  // Handler for files selected via the standard file input (triggered by IKUpload or button)
  const handleFileSelect = (eventOrFiles) => {
      let files = [];
      if (eventOrFiles.target && eventOrFiles.target.files) {
          // Comes from input element change event
          files = Array.from(eventOrFiles.target.files);
      } else if (Array.isArray(eventOrFiles)) {
          // Comes from manual trigger like paste/camera
          files = eventOrFiles;
      }

      const addedFiles = addFilesForPreview(files); // Add previews first

      // *** This part needs rethinking - IKUpload with 'multiple' handles its own batch ***
      // If IKUpload is handling multiple files, we don't need to manually trigger each one.
      // We only need to manually trigger for paste/camera.

      // Reset file input ref value if it was used
      if (fileInputRef.current) {
          fileInputRef.current.value = "";
      }
       if (ikUploadRef.current?.value) { // Reset IKUpload's internal input too if possible/needed
            ikUploadRef.current.value = "";
       }
  };

  // Handler specifically for files added via Paste or Camera
  const enqueueManualUpload = (files) => {
      const addedFiles = addFilesForPreview(files); // Add previews
      if (addedFiles.length > 0) {
          setManualQueue(prev => [...prev, ...addedFiles]); // Add the actual files to the manual queue
      }
  };


  // Effect to process the manual queue one by one
  useEffect(() => {
      if (!fileToUpload && manualQueue.length > 0) {
          const nextFile = manualQueue[0];
          setManualQueue(prev => prev.slice(1)); // Remove from queue
          setFileToUpload(nextFile); // Trigger upload via file prop

          // Update preview status
          setPreviewImages(prev => prev.map(p => p.name === nextFile.name && p.status === 'pending' ? { ...p, status: 'uploading' } : p));
      }
  }, [manualQueue, fileToUpload]); // Runs when queue changes or upload finishes


  const onError = (err, { file, xhr }) => { // IKUpload often passes file/xhr details
    console.error("Upload Error:", err);
    const failedFileName = fileToUpload?.name || (err?.details?.fileInfo?.name) || "Unknown file"; // Try to get name
    toast.error(`Upload failed for ${failedFileName}: ${err?.message || "Please try again."}`);

    // Update preview status for the failed file
    setPreviewImages(prev => prev.map(p => p.name === failedFileName && p.status === 'uploading' ? { ...p, status: 'error' } : p));

    setProgress(0);
    if (fileToUpload && fileToUpload.name === failedFileName) {
      setFileToUpload(null); // Clear current upload slot to allow next manual item
    }
  };

  const onSuccess = (res) => { // res contains uploaded file details
    const successfulFileName = fileToUpload?.name || res.name; // Prefer fileToUpload name if available

    setData((prev) => [...prev, { url: res.url, fileId: res.fileId }]);

     // Update preview status for the successful file
    setPreviewImages(prev => prev.map(p => p.name === successfulFileName && p.status === 'uploading' ? { ...p, status: 'success', url: res.url, fileId: res.fileId, file: null } : p)); // Remove file object after success? Optional.

    setProgress(0); // Reset progress for next upload
    if (fileToUpload && fileToUpload.name === successfulFileName) {
       setFileToUpload(null); // Clear current upload slot to allow next manual item
    }
  };


  const onUploadProgress = (progress) => {
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
      enqueueManualUpload(files); // Use the manual queue for pasted files
    }
  }, [enqueueManualUpload, type]); // Updated dependency


  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [handlePaste]);


  const removePreview = (indexToRemove) => {
    const removedImagePreview = previewImages[indexToRemove];

    // TODO: Implement cancellation if possible using ImageKit SDK if the file is 'uploading'
    // Example: if (removedImagePreview.status === 'uploading' && ikUploadRef.current?.abort) { ikUploadRef.current.abort(...); }

    setPreviewImages((prev) => prev.filter((_, i) => i !== indexToRemove));

    // If the removed file was the one currently uploading via the manual queue, clear it
    if (fileToUpload && fileToUpload.name === removedImagePreview.name) {
        setFileToUpload(null);
        // Optionally trigger next item from manualQueue if needed, or let the useEffect handle it.
    }
    // Remove from manual queue as well if it's still pending there
    setManualQueue(prev => prev.filter(file => file.name !== removedImagePreview.name));

    URL.revokeObjectURL(removedImagePreview.localUrl);
  };

  const openCamera = async () => {
      if (previewImages.length >= MAX_IMAGES) {
         toast.warn(`Maximum ${MAX_IMAGES} images allowed.`);
         return;
      }
      // ... (rest of openCamera is likely fine)
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
     // ... (capture logic is likely fine)
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
        enqueueManualUpload([file]); // Use the manual queue for captured photos
      } else {
        toast.error("Failed to capture image.");
      }
      closeCamera();
    }, "image/jpeg");
  };

  // closeCamera remains the same...
  const closeCamera = () => {
     // ... (keep existing implementation)
  };

  // Cleanup effect remains the same...
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
      {/* This IKUpload handles uploads triggered manually via the 'file' prop */}
      <IKUpload
        useUniqueFileName={true}
        onError={onError}
        onSuccess={onSuccess}
        onUploadProgress={onUploadProgress}
        className="hidden"
        file={fileToUpload} // Upload triggered when this prop changes
        fileName={fileToUpload?.name} // Recommended when using 'file' prop
        key={fileToUpload?.name || 'idle'} // Force re-render on new file
      />

       {/* We might still need a hidden input for the "Select Files" button */}
       <input
           type="file"
           multiple
           className="hidden"
           ref={fileInputRef}
           accept={`${type}/*`}
           onChange={(e) => {
                // **Here we need to decide strategy**
                // Option A: Let IKUpload handle this (remove this input, trigger ikUploadRef.current.click())
                // Option B: Use this input, then manually queue the files (like paste/camera)
                // Let's stick with Option B for consistency with paste/camera for now
                if (e.target.files) {
                    enqueueManualUpload(Array.from(e.target.files));
                }
           }}
       />


      {/* Clickable Area for Upload */}
      <div
          className="p-4 border-2 border-dashed border-[var(--softBg4)] rounded-lg text-center cursor-pointer hover:bg-[var(--softBg2)] transition-colors"
          onClick={() => fileInputRef.current?.click()} // Trigger hidden input
          // Add Drag & Drop handlers here if desired, calling enqueueManualUpload
          role="button"
          tabIndex={0}
          onKeyPress={(e) => { if (e.key === 'Enter') fileInputRef.current?.click(); }}
      >
          <FaUpload className="mx-auto mb-2 text-xl text-[var(--softTextColor)]"/>
          {previewImages.length === 0
            ? "Click or Drag & Drop Images Here"
            : `Add more images (${previewImages.length}/${MAX_IMAGES})`}
            <span className="block text-xs text-[var(--softTextColor)]">(Or paste images)</span>
       </div>


      <div className="flex gap-2 mt-2">
         <button
             type="button"
             className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
             onClick={() => fileInputRef.current?.click()} // Trigger the hidden input
             disabled={previewImages.length >= MAX_IMAGES}
         >
             Select Files
         </button>
         <button
             type="button"
             className="p-2 bg-green-500 text-white rounded flex items-center hover:bg-green-600 transition-colors disabled:opacity-50"
             onClick={openCamera}
             disabled={previewImages.length >= MAX_IMAGES}
          >
             <FaCamera className="mr-1" /> Take Photo
         </button>
      </div>

      {/* Camera Modal remains the same */}
      {cameraOpen && (
          // ... (keep existing modal JSX)
      )}

      {/* Image Previews Grid */}
      {previewImages.length > 0 && (
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
          {previewImages.map((img, index) => (
            <div key={`${img.name}-${index}`} className="relative group aspect-square"> {/* Better key */}
              <img
                src={img.localUrl}
                alt={`Preview ${img.name}`}
                className={`w-full h-full object-cover rounded border ${
                    img.status === 'uploading' ? 'opacity-50' : ''
                  } ${
                    img.status === 'error' ? 'border-red-500' : 'border-[var(--softBg4)]'
                  }`}
              />
              {/* Optional: Show status indicator */}
              {img.status === 'uploading' && <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-25 text-white text-xs">Uploading...</div>}
              {img.status === 'error' && <div className="absolute inset-0 flex items-center justify-center bg-red-700 bg-opacity-50 text-white text-xs">Error</div>}

              <button
                type="button"
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-70 group-hover:opacity-100 transition-opacity focus:opacity-100 disabled:opacity-30"
                onClick={() => removePreview(index)}
                aria-label="Remove image"
                disabled={img.status === 'uploading'} // Disable remove while uploading? Optional.
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
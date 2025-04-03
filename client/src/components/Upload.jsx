import { IKContext, IKUpload } from "imagekitio-react";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

// Assuming you have icons for camera and trash
// You can replace these with actual icon components (e.g., from react-icons)
const CameraIcon = () => <svg /* camera svg */ />;
const TrashIcon = () => <svg /* trash svg */ />;
const UploadIcon = () => <svg /* upload/plus svg */ />; // Icon for the dropzone area

const MAX_IMAGES = 10;

// --- Authentication Function (keep as is) ---
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

// --- New Enhanced Upload Component ---
const Upload = ({
  onUploadComplete, // Callback to pass final uploaded files to parent
  initialFiles = [], // Allow passing existing uploaded files
  accept = "image/*", // Default to images, but allow customization
}) => {
  const ikUploadRef = useRef(null);
  const cameraInputRef = useRef(null); // Ref for the camera input

  // State Management
  const [uploadedFiles, setUploadedFiles] = useState(initialFiles); // Files successfully uploaded
  const [filesToUpload, setFilesToUpload] = useState([]); // Files selected, waiting for upload confirmation (includes previews)
  const [uploadingFiles, setUploadingFiles] = useState({}); // Track progress: { tempId: { progress: number, name: string } }
  const [selectedForDelete, setSelectedForDelete] = useState(new Set()); // Set of uploaded file IDs/URLs to delete

  // Effect to notify parent when uploadedFiles change
  useEffect(() => {
    if (onUploadComplete) {
      onUploadComplete(uploadedFiles);
    }
  }, [uploadedFiles, onUploadComplete]);

  // Generate unique temporary ID for tracking files before upload
  const generateTemporaryId = (file) => {
      return `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`;
  }

  // --- File Selection & Handling ---
  const handleFileSelection = (event) => {
    const newFiles = Array.from(event.target.files);
    processSelectedFiles(newFiles);
    // Reset file input value to allow selecting the same file again
     if(event.target) {
       event.target.value = null;
     }
  };

  const processSelectedFiles = (newFiles) => {
    const availableSlots = MAX_IMAGES - uploadedFiles.length - filesToUpload.length;

    if (newFiles.length === 0) return;

    if (availableSlots <= 0) {
      toast.warn(`You can upload a maximum of ${MAX_IMAGES} images.`);
      return;
    }

    const filesToAdd = newFiles.slice(0, availableSlots);

    if (newFiles.length > availableSlots) {
        toast.info(`Selected ${newFiles.length} files, but only the first ${filesToAdd.length} can be added due to the limit of ${MAX_IMAGES}.`);
    }

    const filesWithPreview = filesToAdd.map((file) => ({
      id: generateTemporaryId(file), // Use temp ID
      file: file,
      preview: URL.createObjectURL(file),
    }));

    setFilesToUpload((prev) => [...prev, ...filesWithPreview]);
  };

  // --- Camera Capture Handling ---
   const handleCameraClick = () => {
     if (cameraInputRef.current) {
       cameraInputRef.current.click();
     }
   };

   const handleCameraFileSelect = (event) => {
     const file = event.target.files?.[0];
     if (file) {
       processSelectedFiles([file]); // Process the single captured file
     }
     // Reset file input value
     if(event.target) {
       event.target.value = null;
     }
   };


  // --- Upload Logic ---
  // Function to trigger the actual upload of files currently in filesToUpload
  const startUpload = () => {
    if (filesToUpload.length === 0) {
      toast.info("No new files selected to upload.");
      return;
    }
    // Use the ref to trigger IKUpload's internal upload mechanism
    // Note: IKUpload might not directly support uploading a File list programmatically easily.
    // A common pattern is to have the IKUpload input be clicked, OR manage uploads manually
    // using ImageKit's core SDK if IKUpload component is too restrictive.

    // Let's assume clicking the hidden IKUpload input triggers selection *again*,
    // which isn't ideal. A better approach might be needed if this doesn't work as expected.
    // *Alternative/Robust Approach:* Use ImageKit's core JS SDK's `upload` function directly
    // for each file in `filesToUpload`. This gives more control but bypasses `IKUpload` component benefits.

    // *Workaround with IKUpload*: We might need to rely on the user clicking the area
    // which triggers the IKUpload input naturally. Let's refine the callbacks.
    // The `IKUpload` component will handle the files *selected via its input*.
    // We need to manage the state *around* it.

    // Let's clear filesToUpload and let IKUpload handle the new selection implicitly
    // This means the preview state (`filesToUpload`) is mostly for display *before* the
    // hidden input is triggered. Let's adjust how we think about the flow.

    // ---- Revised Flow ---
    // 1. User clicks "Select Files" or drops files.
    // 2. `handleFileSelection` is called via the hidden `IKUpload`'s input `onChange`.
    // 3. `processSelectedFiles` updates `filesToUpload` for *preview*.
    // 4. **Crucially**: `IKUpload` *itself* initiates the upload for the files it received.
    // 5. We use `onUploadStart`, `onProgress`, `onSuccess`, `onError` to update our state based on IKUpload's actions.

    // We don't need a separate `startUpload` button/function with this flow.
    // The selection itself triggers the upload via IKUpload.

    // **Clean up preview state** - this should happen when upload starts for a file.
    // Let's do this inside `onUploadStart`.
  };


  // --- IKUpload Callbacks ---
   const onUploadStart = (evt) => {
     console.log("Upload started", evt); // evt might be limited here
     // We need a way to link this start event back to our `filesToUpload` item.
     // IKUpload doesn't easily provide the specific File object here.
     // This makes per-file progress tracking before success difficult with IKUpload component.

     // Let's assume progress updates are global or for the *latest* file.
     // We will add files to `uploadingFiles` in `onSuccess` for simplicity for now,
     // acknowledging progress might not be per-file accurately with this setup.
   };


  const onError = (err, file) => {
    console.error("Upload error:", err);
    // Try to find the corresponding file in filesToUpload to remove its preview
    // This linking is difficult. Let's remove the *oldest* file from `filesToUpload` as a guess,
    // or clear all previews on error, which isn't great UX.
    // Or, rely on the file object if IK passes it (check library version/docs).
    toast.error(`Upload failed${file ? ` for ${file.name}` : ''}! ${err.message}`);
    // Clear progress for that file if we were tracking it
    // setUploadingFiles(prev => { const next = {...prev}; delete next[tempId]; return next; });
  };

  const onSuccess = (res) => {
    console.log("Upload success:", res);
    // `res` contains the uploaded file details (url, fileId, name etc.)
    setUploadedFiles((prev) => [...prev, res]);

    // Try to remove the corresponding preview from filesToUpload.
    // Since linking is hard, let's remove the *first* preview that matches the name,
    // or just clear *all* previews once the batch seems done (less ideal).
    setFilesToUpload(prev => {
        const updatedList = prev.filter(f => f.file.name !== res.name); // Basic name matching
        // Clean up the Object URL for the removed preview
        const removed = prev.find(f => f.file.name === res.name);
        if (removed) {
            URL.revokeObjectURL(removed.preview);
        }
        return updatedList;
    });

    // Clear progress tracking for this file if it was added
    // Assuming `res.name` or a unique ID helps find it in `uploadingFiles`
    // setUploadingFiles(prev => { const next = {...prev}; delete next[res.fileId or name]; return next; });
    toast.success(`${res.name} uploaded successfully!`);
  };

  // Global progress - might represent the currently uploading file in the batch
  const onUploadProgress = (progress) => {
    // console.log("Progress:", progress); // { loaded, total }
    // Can't easily tie this to a specific preview file with IKUpload component.
    // We could show a *global* progress bar based on this.
    // Or update the *last* file added to `uploadingFiles`.
    // Let's simplify and not show fine-grained progress during upload for now.
    // We will show previews, then they become uploaded items on success.
  };


  // --- Deletion Logic ---
  const removePreviewFile = (idToRemove) => {
      setFilesToUpload((prev) =>
          prev.filter((item) => {
              if (item.id === idToRemove) {
                  URL.revokeObjectURL(item.preview); // Clean up memory
                  return false;
              }
              return true;
          })
      );
  };

  const toggleSelectionForDelete = (fileIdentifier) => { // Use URL or fileId
    setSelectedForDelete((prev) => {
      const next = new Set(prev);
      if (next.has(fileIdentifier)) {
        next.delete(fileIdentifier);
      } else {
        next.add(fileIdentifier);
      }
      return next;
    });
  };

  const deleteSelectedUploadedFiles = () => {
    // NOTE: Deleting from ImageKit storage usually requires backend authentication
    // and using the ImageKit Admin API. This function will only remove files
    // from the *frontend state*. Actual deletion needs a backend call.
    console.warn("Deleting from frontend state only. Implement backend deletion logic.");

    setUploadedFiles((prev) =>
      prev.filter((file) => !selectedForDelete.has(file.fileId || file.url)) // Check both fileId and url
    );
    setSelectedForDelete(new Set()); // Clear selection
    toast.info("Selected files removed from the list.");
    // TODO: Add backend API call here to delete files from ImageKit storage
  };

  const deleteSingleUploadedFile = (fileIdentifier) => {
      // Similar to bulk delete, primarily frontend state removal.
      console.warn("Deleting from frontend state only. Implement backend deletion logic.");
      setUploadedFiles((prev) =>
          prev.filter((file) => (file.fileId || file.url) !== fileIdentifier)
      );
       // Ensure it's removed from selection if it was selected
      setSelectedForDelete((prev) => {
        const next = new Set(prev);
        next.delete(fileIdentifier);
        return next;
      });
      toast.info("File removed from the list.");
       // TODO: Add backend API call here
  }


  // --- Cleanup Object URLs ---
  useEffect(() => {
    // Cleanup function runs when component unmounts
    return () => {
      filesToUpload.forEach((item) => URL.revokeObjectURL(item.preview));
      console.log("Cleaned up preview Object URLs");
    };
  }, [filesToUpload]); // Rerun if filesToUpload changes (though cleanup on unmount is key)


  // --- Render Logic ---
  const remainingSlots = MAX_IMAGES - uploadedFiles.length - filesToUpload.length;

  return (
    <IKContext
      publicKey={import.meta.env.VITE_IK_PUBLIC_KEY}
      urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
      authenticator={authenticator}
    >
      <div className="p-4 border border-dashed border-gray-400 rounded-lg">
        {/* Combined Dropzone / Click Trigger */}
        <div
            className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100 transition-colors mb-4"
            onClick={() => remainingSlots > 0 && ikUploadRef.current?.click()}
            title={remainingSlots <= 0 ? `Maximum ${MAX_IMAGES} images reached` : `Select up to ${remainingSlots} more images`}
            style={{ opacity: remainingSlots <= 0 ? 0.5 : 1, cursor: remainingSlots <= 0 ? 'not-allowed' : 'pointer' }}
        >
            <UploadIcon /> {/* Replace with your icon */}
            <span className="mt-2 text-sm text-gray-600">
                Click to select files or drag and drop
            </span>
            <span className="text-xs text-gray-500">Max {MAX_IMAGES} images. {remainingSlots} slots remaining.</span>
            {/* Hidden Input managed by IKUpload */}
            <IKUpload
                ref={ikUploadRef}
                onError={onError}
                onSuccess={onSuccess}
                // onUploadStart={onUploadStart} // Optional: If needed for state updates
                // onUploadProgress={onUploadProgress} // Optional: For global progress
                useUniqueFileName={true}
                accept={accept}
                multiple={true}
                onChange={handleFileSelection} // Key: Intercept selection
                className="hidden" // Keep it hidden
                disabled={remainingSlots <= 0}
             />
        </div>


        {/* Camera Capture Button */}
        <button
            type="button"
            onClick={handleCameraClick}
            disabled={remainingSlots <= 0}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            title={remainingSlots <= 0 ? `Maximum ${MAX_IMAGES} images reached` : 'Use Camera'}
        >
            <CameraIcon /> Use Camera
        </button>
         {/* Hidden input for camera */}
         <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment" // or "user" for front camera
            onChange={handleCameraFileSelect}
            className="hidden"
         />

        {/* Preview Area for Files Selected (Pre-Upload) */}
        {filesToUpload.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Files ready to upload ({filesToUpload.length}):</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {filesToUpload.map((item) => (
                <div key={item.id} className="relative group aspect-square">
                  <img
                    src={item.preview}
                    alt={`Preview ${item.file.name}`}
                    className="object-cover w-full h-full rounded-md border border-gray-200"
                    onLoad={() => { /* Optional: Could revoke URL earlier if needed, but cleanup effect handles it */ }}
                  />
                   {/* Progress indicator could go here if trackable */}
                  <button
                    type="button"
                    onClick={() => removePreviewFile(item.id)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-75 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove file"
                    title="Remove file before upload"
                  >
                    <TrashIcon /> {/* Replace with your icon */}
                  </button>
                </div>
              ))}
            </div>
             {/* Optional: Add a button to explicitly start the upload if needed, though current flow auto-starts */}
             {/* <button onClick={startUpload} className="mt-2 px-3 py-1 bg-green-500 text-white rounded">Upload Selected</button> */}
          </div>
        )}

         {/* Display Area for Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                 <h3 className="text-sm font-medium text-gray-700">Uploaded Files ({uploadedFiles.length}):</h3>
                 {selectedForDelete.size > 0 && (
                    <button
                        type="button"
                        onClick={deleteSelectedUploadedFiles}
                        className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 flex items-center gap-1"
                    >
                         <TrashIcon /> Delete Selected ({selectedForDelete.size})
                    </button>
                 )}
              </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {uploadedFiles.map((file) => {
                  const identifier = file.fileId || file.url; // Use fileId if available, else fallback to URL
                  const isSelected = selectedForDelete.has(identifier);
                  return (
                    <div key={identifier} className="relative group aspect-square">
                      <img
                        src={file.thumbnailUrl || file.url} // Use thumbnail if available
                        alt={file.name || 'Uploaded file'}
                        className={`object-cover w-full h-full rounded-md border ${isSelected ? 'border-red-500 ring-2 ring-red-300' : 'border-gray-300'}`}
                      />
                       {/* Checkbox for Bulk Delete Selection */}
                       <input
                           type="checkbox"
                           checked={isSelected}
                           onChange={() => toggleSelectionForDelete(identifier)}
                           className="absolute top-1 left-1 h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
                           aria-label={`Select ${file.name || 'file'} for deletion`}
                       />
                      {/* Single Delete Button */}
                      <button
                        type="button"
                        onClick={() => deleteSingleUploadedFile(identifier)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={`Delete ${file.name || 'file'}`}
                        title="Delete this file"
                      >
                         <TrashIcon /> {/* Replace with your icon */}
                      </button>
                      {/* Optional: Display file name or other info */}
                      {/* <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">{file.name}</div> */}
                    </div>
                );
                })}
            </div>
          </div>
        )}

      </div>
    </IKContext>
  );
};

export default Upload;
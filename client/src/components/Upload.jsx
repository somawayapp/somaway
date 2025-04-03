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
  const inputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const onError = (err) => {
    console.log(err);
    toast.error("Image upload failed!");
  };

  const onSuccess = (res) => {
    console.log("Upload successful:", res);
    setData((prev) => [...prev, res]); // Append uploaded file to state
  };

  const onUploadProgress = (progress) => {
    console.log("Upload Progress:", progress);
    setProgress(Math.round((progress.loaded / progress.total) * 100));
  };

  // Handles file selection
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files); // Store files to render multiple `IKUpload`
  };

  return (
    <IKContext
      publicKey={import.meta.env.VITE_IK_PUBLIC_KEY}
      urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
      authenticator={authenticator}
    >
      {/* Hidden file input */}
      <input
        type="file"
        multiple
        accept={`${type}/*`}
        className="hidden"
        ref={inputRef}
        onChange={handleFileSelect}
      />

      {/* Clickable upload button */}
      <div
        className="cursor-pointer"
        onClick={() => inputRef.current && inputRef.current.click()}
      >
        {children}
      </div>

      {/* Render an IKUpload for each selected file */}
      {selectedFiles.map((file, index) => (
        <IKUpload
          key={index}
          useUniqueFileName
          fileName={file.name} // Pass the selected file
          file={file} // Pass the actual file object
          onError={onError}
          onSuccess={onSuccess}
          onUploadProgress={onUploadProgress}
          className="hidden"
        />
      ))}
    </IKContext>
  );
};

export default Upload;


import { IKContext, IKUpload } from "imagekitio-react";
import { useRef } from "react";
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
  const ref = useRef(null);
  const inputRef = useRef(null); // Reference for file input

  const onError = (err) => {
    console.log(err);
    toast.error("Image upload failed!");
  };

  const onSuccess = (res) => {
    console.log(res); // Log response to check data format
    if (Array.isArray(res)) {
      res.forEach((file) => {
        setData((prev) => [...prev, file]); // Append each file to the state
      });
    } else {
      setData((prev) => [...prev, res]); // For single file uploads
    }
  };

  const onUploadProgress = (progress) => {
    console.log(progress);
    setProgress(Math.round((progress.loaded / progress.total) * 100));
  };

  // Handles file selection and uploads each file manually
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    files.forEach((file) => {
      if (ref.current) {
        ref.current.uploadFile(file);
      }
    });
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

      {/* IKUpload Component */}
      <IKUpload
        useUniqueFileName
        onError={onError}
        onSuccess={onSuccess}
        onUploadProgress={onUploadProgress}
        className="hidden"
        ref={ref}
      />

      {/* Clickable area to open file input */}
      <div
        className="cursor-pointer"
        onClick={() => inputRef.current && inputRef.current.click()}
      >
        {children}
      </div>
    </IKContext>
  );
};

export default Upload;

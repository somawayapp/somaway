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

  const onError = (err) => {
    console.log(err);
    toast.error("Image upload failed!");
  };

  const onSuccess = (res) => {
    console.log(res);
    setData((prev) => [...prev, res]); // Append new image(s) to array
  };

  const onUploadProgress = (progress) => {
    console.log(progress);
    setProgress(Math.round((progress.loaded / progress.total) * 100));
  };

  const handleMultipleUpload = (files) => {
    // Loop through each selected file and upload them
    files.forEach((file) => {
      ref.current.upload(file); // Trigger upload for each file
    });
  };

  return (
    <IKContext
      publicKey={import.meta.env.VITE_IK_PUBLIC_KEY}
      urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
      authenticator={authenticator}
    >
      <IKUpload
        useUniqueFileName
        onError={onError}
        onSuccess={onSuccess}
        onUploadProgress={onUploadProgress}
        className="hidden"
        ref={ref}
        accept={`${type}/*`}
        multiple // Allow multiple files
      />
      <div
        className="cursor-pointer"
        onClick={() => {
          const fileInput = ref.current;
          fileInput.click(); // Open file picker
          fileInput.addEventListener("change", (e) => {
            const selectedFiles = e.target.files;
            handleMultipleUpload(selectedFiles); // Upload all selected files
          });
        }}
      >
        {children}
      </div>
    </IKContext>
  );
};

export default Upload;



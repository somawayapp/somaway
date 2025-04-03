import { IKContext } from "imagekitio-react";
import { useRef, useState } from "react";
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
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const imageKit = useRef(null); // Reference to the ImageKit instance

  const onError = (err) => {
    console.log(err);
    toast.error("Image upload failed!");
  };

  const onSuccess = (res) => {
    console.log(res);
    setData((prev) => [...prev, res]); // Append new image(s) to array
    triggerNextUpload(); // Trigger next upload after success
  };

  const onUploadProgress = (progress) => {
    console.log(progress);
    setProgress(Math.round((progress.loaded / progress.total) * 100));
  };

  const handleMultipleUpload = (files) => {
    // Store all files to be uploaded
    setFilesToUpload(Array.from(files));
    setCurrentIndex(0);
    triggerNextUpload(); // Start the upload process
  };

  const triggerNextUpload = () => {
    if (currentIndex < filesToUpload.length) {
      const file = filesToUpload[currentIndex];
      imageKit.current.upload({
        file: file, // The file to upload
        fileName: file.name, // Set the filename
        signature: file.signature, // Use the signature you fetch from your server
        token: file.token, // Use the token from the server
        expire: file.expire, // Expiration time from the server
      }).then((res) => {
        onSuccess(res); // Handle success
        setCurrentIndex(currentIndex + 1); // Increment to move to the next file
      }).catch((err) => {
        onError(err); // Handle errors
      });
    }
  };

  return (
    <IKContext
      publicKey={import.meta.env.VITE_IK_PUBLIC_KEY}
      urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
      authenticator={authenticator}
    >
      <div
        className="cursor-pointer"
        onClick={() => {
          const fileInput = document.createElement('input');
          fileInput.type = 'file';
          fileInput.accept = `${type}/*`;
          fileInput.multiple = true;
          fileInput.click();
          
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


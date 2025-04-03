import { IKContext, IKUpload } from "imagekitio-react";
import { useState } from "react";
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
  const [files, setFiles] = useState([]);

  const onError = (err) => {
    console.log(err);
    toast.error("Image upload failed!");
  };

  const onSuccess = (res) => {
    console.log(res);
    setData((prev) => [...prev, res]);
  };

  const onUploadProgress = (progress) => {
    console.log(progress);
    setProgress(Math.round((progress.loaded / progress.total) * 100));
  };

  const handleFileSelection = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);

    // Upload each file one by one
    for (const file of selectedFiles) {
      await new Promise((resolve) => {
        const uploader = document.createElement("input");
        uploader.type = "file";
        uploader.accept = `${type}/*`;
        uploader.style.display = "none";

        const ikUpload = (
          <IKUpload
            useUniqueFileName
            onError={onError}
            onSuccess={(res) => {
              onSuccess(res);
              resolve();
            }}
            onUploadProgress={onUploadProgress}
            file={file} // Upload file one by one
          />
        );

        document.body.appendChild(uploader);
        uploader.click();
      });
    }
  };

  return (
    <IKContext
      publicKey={import.meta.env.VITE_IK_PUBLIC_KEY}
      urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
      authenticator={authenticator}
    >
      <input
        type="file"
        multiple
        onChange={handleFileSelection}
        className="hidden"
      />
      <div className="cursor-pointer" onClick={() => document.querySelector('input[type="file"]').click()}>
        {children}
      </div>
    </IKContext>
  );
};

export default Upload;

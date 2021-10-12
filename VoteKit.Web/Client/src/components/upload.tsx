import { useState } from "react";
import { useDropzone } from "react-dropzone";

export function ImageUploader({ children, projectId, className = "", accept = "image/*", onChange, onError = (err: Error) => {} }) {
  const [working, setWorking] = useState(false);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    accept,
    onDrop: async (files) => {
      if (!files.length) return;

      setWorking(true);

      try {
        onChange(await uploadImage(files[0], { projectId }));
      } catch (e) {
        onError(e);
      } finally {
        setWorking(false);
      }
    },
  });

  return (
    <div
      {...getRootProps({
        className: `${className} ${isDragAccept ? "upload-active" : ""}`,
      })}
      style={{
        backgroundImage: `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHUlEQVQ4jWNgYGAQIYAJglEDhoUBg9+FowbQ2gAARjwKARjtnN8AAAAASUVORK5CYII=")`,
      }}
    >
      {working ? <div className="spinner-overlay" /> : null}
      <input {...getInputProps()} />
      {children}
    </div>
  );
}

export async function uploadImage(file, fields = {}) {
  const fd = new FormData();

  fd.append("Content-Type", file.type);
  fd.append("file", file);

  for (let key of Object.keys(fields)) {
    fd.append(key, fields[key]);
  }

  return await new Promise<any>((res, rej) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.onreadystatechange = function () {
      if (this.readyState === 4 && this.status >= 200 && this.status < 300) res(JSON.parse(this.responseText));
      else if (this.readyState === 4) rej(new Error("Unable to upload file. Unsupported file format or file size limit (20MB) exceeded "));
    };

    xhr.open("POST", "/api/upload", true);
    xhr.send(fd);
  });
}

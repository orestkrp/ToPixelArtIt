import { useState } from "react";
import { Input } from "./input";
import { Label } from "./label";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useShallow } from "zustand/shallow";
import { useStore } from "@/store";
import clsx from "clsx";
import { Button } from "./button";

export const ImageInput = () => {
  const [dragActive, setDragActive] = useState(false);

  const { picture, setPicture, clearImage, result } = useStore(
    useShallow((state) => ({
      picture: state.picture,
      setPicture: state.setPicture,
      clearResult: state,
      clearImage: state.clearImage,
      result: state.result,
    }))
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedImage = e.target.files[0];
      if (selectedImage) {
        setPicture(selectedImage);
        console.log(selectedImage);
      }
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setPicture(e.dataTransfer.files[0]);
    }
  };

  const imageSrc = picture ? URL.createObjectURL(picture) : null;

  return (
    <div
      className={clsx(
        `flex-1 border-2 border-blue-500 ${
          dragActive ? "border-solid" : "border-dashed"
        }`
      )}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center">
        {imageSrc ? (
          <img
            src={result || imageSrc}
            alt="selected image"
            className="w-full max-w-full"
          />
        ) : (
          <>
            <Label>
              <FaCloudUploadAlt />
              Drag and drop to upload file or
            </Label>
            <Input onChange={handleFileChange} type="file" className="w-fit" />
          </>
        )}
      </div>
      <Button type="button" onClick={() => clearImage()}>
        Clear
      </Button>
    </div>
  );
};

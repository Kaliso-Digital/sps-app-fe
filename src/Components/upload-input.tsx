import React, { useRef } from "react";

type UploadComponentProps = {
  render: () => JSX.Element;
  label: string;
} & React.HTMLProps<HTMLInputElement>;

export const UploadInput: React.FC<UploadComponentProps> = ({
  render,
  label,
  ...inputProps
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleContainerClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      <span className="text-sm font-bold pb-1">{label}</span>
      <label
        htmlFor="imageUpload"
        className="image-upload-label flex justify-center items-center w-full h-32 p-3 border-[3px] border-dashed rounded text-sm font-medium focus:ring-1 focus:ring-gray-400 focus:outline-none"
        onClick={handleContainerClick}
      >
        <div className="image-upload-container flex justify-center items-center flex-col">
          {render()}
        </div>
        <input
          className="hidden"
          {...inputProps}
          type="file"
          ref={fileInputRef}
        />
      </label>
    </div>
  );
};

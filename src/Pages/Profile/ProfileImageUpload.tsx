// ProfileImageUpload.tsx
import React from 'react';

type ProfileImageUploadProps = {
  editMode: boolean;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: () => void;
  renderImagePreview: () => React.ReactNode;
};

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  editMode,
  handleImageUpload,
  handleRemoveImage,
  renderImagePreview,
}) => {
  return (
    <div className="w-full items-center justify-start text-sm text-red-400 pl-2 pb-4">
      <label
        htmlFor="imageUpload"
        className="image-upload-label flex justify-center items-center w-28 h-28 p-3 mb-2 border-[3px] border-dashed rounded text-sm font-medium focus:ring-1 focus:ring-gray-400 focus:outline-none"
      >
        <div className="image-upload-container flex justify-center items-center flex-col ">
          {renderImagePreview()}
        </div>
        {editMode && (
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        )}
      </label>
      {editMode && (
        <button onClick={handleRemoveImage} className="remove-image-button">
          Remove Picture
        </button>
      )}
    </div>
  );
};

export default ProfileImageUpload;
import React from 'react';
import { Button, Typography } from "@mui/material";

type ProfileEditButtonsProps = {
  editMode: boolean;
  handleCancelChanges: () => void;
  handleSaveChanges: () => void;
  setEditMode: (value: boolean) => void;
};

const ProfileEditButtons: React.FC<ProfileEditButtonsProps> = ({ editMode, handleCancelChanges, handleSaveChanges, setEditMode }) => {
  if (editMode) {
    return (
      <div className="edit-buttons flex gap-2">
        <Button
          onClick={handleCancelChanges}
          variant="outlined"
          style={{
            borderColor: "#FF4949",
            borderWidth: 2,
            fontWeight: "500",
            color: "#FF4949",
            textTransform: "capitalize"
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSaveChanges}
          variant="contained"
          className="items-center gap-2 flex flex-row justify-center text-white text-base font-semibold tracking-wide text-center bg-[#0D8FFD] hover:bg-blue-700 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          Save Changes
        </Button>
      </div>
    );
  } else {
    return (
      <Button
        onClick={() => setEditMode(!editMode)}
        variant="contained"
        className="items-center gap-2 flex flex-row justify-center text-white text-base font-semibold tracking-wide text-center bg-[#0D8FFD] hover:bg-blue-700 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
          />
        </svg>
        Edit Profile
      </Button>
    );
  }
};

export default ProfileEditButtons;

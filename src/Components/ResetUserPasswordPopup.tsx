import React, { useState, ChangeEvent } from "react";
import { toast } from 'react-toastify';
import { putJSONData } from "../Service/apiService";

interface ResetUserPasswordProps {
  user: number;
  onClose: () => void;
}

const ResetUserPasswordPopup: React.FC<ResetUserPasswordProps> = ({ user, onClose }) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSaveChanges = async () => {
    setIsDisabled(true);

    try {
      const response = await putJSONData(`user/${user}/reset-password`, {
        "password" : password,
        "confirmPassword" : confirmPassword
      });
      
      if (response) {
        onClose();
      }
    } catch (error) {
      toast.error(`Soemthing went wrong! ${error}`);
    }

    setIsDisabled(false);
  };


  return (
    <div className="fixed inset-0 overflow-y-auto bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-md w-[600px]">
        <div className="flex flex-row items-center justify-center mb-4">
          <div className="text-xl font-bold">Reset Password</div>
        </div>

        <div className=" flex flex-row w-full">
            <div className="w-full flex flex-col">
                <div className="mb-2">
                <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="password"
                >
                    Password
                </label>
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none text-xs rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none 
                            border border-neutral-400 border-opacity-20"
                />
                </div>
                <div className="mb-2">
                <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="confirmPassword"
                >
                    Confirm Password
                </label>
                <input
                    type="password"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none text-xs rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none 
                            border border-neutral-400 border-opacity-20"
                />
                </div>
            </div>
        </div>

        {/* Save and Cancel Buttons */}
        <div className="flex justify-end mt-4">
          <button
            className="text-red-500 px-4 py-1 mr-2 rounded border-2 border-red-500 font-bold text-base hover:bg-red-500 hover:text-white"
            disabled={isDisabled}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-1 rounded text-base"
            disabled={isDisabled}
            onClick={handleSaveChanges}
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetUserPasswordPopup;
import React, { useState, ChangeEvent, useEffect } from "react";
import { toast } from 'react-toastify';
import PhoneInput from "react-phone-number-input";
import { makeRequest } from "../../Service/api";
import Popup from "../../Interface/Popup";
import { INQUIRYURL, USERURL } from "../../Constants/api";
import { useParams } from "react-router-dom";
import Select from 'react-select';

const ActionInquiry: React.FC<Popup> = ({ onClose, handleAction, title }) => {
  const { id } = useParams<{ id?: string }>();
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Call the parent's onSubmit function with the textarea value
    if (handleAction) {
      handleAction(reason);
    }
  };

  return (
    <div className="fixed inset-0 overflow-y-auto bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-md w-[400px]">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-row items-center justify-center mb-4">
            <div className="text-xl font-semibold">{title}</div>
          </div>

          {/* Two-Column Input Fields */}
          <div className=" flex flex-row w-full">
            <div className="w-full flex flex-col gap-4">
              <div className="mb-2">
                <textarea
                  name="description"
                  placeholder="Reasons..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full  p-3 border rounded h-28 text-gray-800 text-sm font-medium  focus:ring-1 focus:ring-gray-400 focus:outline-none "
                  rows={3} // You can adjust the number of rows as needed
                />
              </div>
            </div>
          </div>

          {/* Supplier-Specific Fields */}

          {/* Save and Cancel Buttons */}
          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="text-red-500 px-4 py-1 mr-2 rounded border-2 border-red-500 font-bold text-base hover:bg-red-500 hover:text-white"
              disabled={loading}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-1 rounded text-base"
              disabled={loading}
            >
              Complete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActionInquiry;

import React, { useState, ChangeEvent, useEffect } from "react";
import { toast } from 'react-toastify';
import PhoneInput from "react-phone-number-input";
import { makeRequest } from "../../Service/api";
import Popup from "../../Interface/Popup";
import { INQUIRYURL, USERURL } from "../../Constants/api";
import { useParams } from "react-router-dom";
import Select from 'react-select';

const QuantityInquiry: React.FC<Popup> = ({ onClose, handleAction, title }) => {
  const { id } = useParams<{ id?: string }>();
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Call the parent's onSubmit function with the textarea value
    if (handleAction) {
      handleAction(quantity);
    }
  };

  return (
    <div className="fixed inset-0 overflow-y-auto bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-md w-[400px]">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-row mb-4">
            <button
              className="text-gray-500 hover:text-gray-700 cursor-pointer pr-3"
              onClick={onClose}
              type="button"
            >
              <svg
                className="w-6 h-6"
                fill="red"
                stroke="red"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <div className="text-xl font-semibold">{title}</div>
          </div>

          {/* Two-Column Input Fields */}
          <div className=" flex flex-row w-full">
            <div className="w-full flex flex-col gap-4">
              <div className="mb-2">
                <input
                  type="number"
                  name="quantity"
                  placeholder="Quantity"
                  value={quantity}
                  className="w-full p-3 border rounded text-gray-800 text-sm font-medium  focus:ring-1 focus:ring-gray-400 focus:outline-none"
                  onChange={(e) => setQuantity(e.target.value)}
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

export default QuantityInquiry;

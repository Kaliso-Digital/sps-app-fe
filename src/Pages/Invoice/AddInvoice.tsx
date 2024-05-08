import React, { useState, useEffect, ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import Popup from "../../Interface/Popup";
import { makeRequest } from "../../Service/api";
import { INQUIRYURL, INVOICEURL } from "../../Constants/api";
import Select, { ActionMeta, SingleValue } from 'react-select';
import { toast } from "react-toastify";

interface Option {
  value: string;
  label: string;
}

const AddInvoicePopup: React.FC<Popup> = ({ onClose, data }) => {
  const { id } = useParams<{ id?: string }>();
  const [loading, setLoading] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<any>();
  const [invoice, setInvoice] = useState<any>();
  const [allQuotes, setAllQuotes] = useState([]);

  useEffect(() => {
    fetchAllQuotes();
  }, []);

  const fetchAllQuotes = async () => {
    setLoading(true);
    const responseData = await makeRequest('get',
      `${INQUIRYURL}/${data}/quote/list`);
    if (responseData.data) {
      setAllQuotes(responseData.data.map((item: any) => ({
        value: item?.id,
        label: `${item?.supplier.name} - ${item?.id}`,
      })));
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type == 'select-one') {
      setSelectedQuote(value)
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    setInvoice(selectedFile)
  };

  const handleSaveChanges = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append('inquiry', data);
    formData.append('quote', selectedQuote);
    formData.append('file', invoice);

    try {
      console.log(selectedQuote);
      const responseData = await makeRequest('post',
        `${INVOICEURL}/`,
        formData,
        {"ngrok-skip-browser-warning": "69420"}
      )

      if (responseData) {
        onClose();
      }
    } catch (error) {
      toast.error(`Something went wrong! ${error}`);
    }

    setLoading(false);
  };

  const renderFilePreview = () => {
    if (invoice) {
      return (
        <div className="file-upload-container flex justify-center items-center flex-col">
          <div className="file-name-preview">
            {(invoice as any)?.name}
          </div>
        </div>
      );
    } else {
      return (
        <div className="file-upload-container flex justify-center items-center flex-col">
          {/* Add icon or placeholder */}
          <div className="file-upload-placeholder">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-6 h-6 text-[#0D8FFD]"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
          </div>
          <div className="file-upload-text text-center">No File Selected</div>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 overflow-y-auto bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-md w-[600px]">
        <div className="flex flex-row items-center justify-center mb-4">
          <div className="text-xl font-bold">Assign Supplier</div>
        </div>

        {/* Two-Column Input Fields */}
        <div className=" flex flex-row gap-6 w-full">
          <div className="w-full flex flex-col gap-4">
            <div className="mb-2">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="firstName"
              >
                Select Quote
              </label>
              <select
                name="userRole"
                value={selectedQuote}
                onChange={handleChange}
                className="appearance-none text-xs rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none 
                          border border-neutral-400 border-opacity-20"
                tabIndex={5}
                required
              >
                <option>Select a Quote</option>
                {allQuotes.map((quote: any) => (
                  <option key={quote?.value} value={quote?.value}>
                    {quote?.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="w-full flex flex-col gap-4">
            <label
              htmlFor="fileUpload"
              className="file-upload-label flex justify-center items-center w-full h-32 p-3 border-[3px] border-dashed rounded text-sm font-medium focus:ring-1 focus:ring-gray-400 focus:outline-none"
            >
              Invoice File
            </label>
            <div className="image-upload-container flex justify-center items-center flex-col ">
              {renderFilePreview()}
            </div>
            <input
              type="file"
              id="fileUpload"
              accept="file/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Save and Cancel Buttons */}
        <div className="flex justify-end mt-4">
          <button
            className="text-red-500 px-4 py-1 mr-2 rounded border-2 border-red-500 font-bold text-base hover:bg-red-500 hover:text-white"
            disabled={loading}
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-1 rounded text-base"
            disabled={loading}
            onClick={handleSaveChanges}
            type="button"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddInvoicePopup;
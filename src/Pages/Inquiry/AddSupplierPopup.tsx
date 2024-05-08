import React, { useState, ChangeEvent, useEffect } from "react";
import { toast } from 'react-toastify';
import PhoneInput from "react-phone-number-input";
import { makeRequest } from "../../Service/api";
import Popup from "../../Interface/Popup";
import { INQUIRYURL, USERURL } from "../../Constants/api";
import { useParams } from "react-router-dom";
import Select from 'react-select';

interface Option {
  value: string;
  label: string;
}

const AddSupplierPopup: React.FC<Popup> = ({ onClose }) => {
  const { id } = useParams<{ id?: string }>();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(3);
  const [selectedSuppliers, setSelectedSuppliers] = useState<Option[]>([]);
  const [allSuppliers, setAllSuppliers] = useState([]);

  useEffect(() => {
    fetchAllSuppliers();
    fetchInquirySuppliers();
  }, []);

  const fetchAllSuppliers = async () => {
    setLoading(true);

    const responseData = await makeRequest('get',
                                           `${USERURL}/list?role=${role}`);
    if (responseData.data) {
      setAllSuppliers(responseData.data.map((item: any) => ({
        value: item?.id,
        label: item?.supplier.name,
      })));
    }
    setLoading(false);
  };

  const fetchInquirySuppliers = async () => {
    setLoading(true);

    const responseData = await makeRequest('get',
                                           `${INQUIRYURL}/${id}/supplier/list`);
    
    if (responseData.data) {
      setSelectedSuppliers(responseData.data.map((item: any) => ({
        value: item?.user.id,
        label: item?.supplier.name,
      })));
    }
    setLoading(false);
  }

  const handleSelectChange = (
    selectedValues: ReadonlyArray<Option>,
    actionMeta: { action: string }
  ) => {
    if (actionMeta.action === 'select-option' || actionMeta.action === 'remove-value') {
      setSelectedSuppliers(selectedValues as Option[]);
    }
  };

  const handleSaveChanges = async () => {
    setLoading(true);

    try {
      console.log(selectedSuppliers);
      const responseData = await makeRequest('post',
        `${INQUIRYURL}/${id}/assign`,
        {supplierIds: selectedSuppliers.map((item: any) => item.value) }
      )

      if (responseData) {
        onClose();
      }
    } catch (error) {
      toast.error(`Something went wrong! ${error}`);
    }

    setLoading(false);
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
                Select Suppliers
              </label>
              <Select
                isMulti
                options={allSuppliers}
                value={selectedSuppliers}
                onChange={handleSelectChange}
                className="appearance-none text-xs rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none 
                        border-neutral-400 border-opacity-20"
              />
              {/* <div>
                Selected Suppliers:
                {selectedSuppliers.map((option: Option) => (
                  <span key={option.value}> {option.label},</span>
                ))}
              </div> */}
            </div>
          </div>
        </div>

        {/* Supplier-Specific Fields */}

        {/* Save and Cancel Buttons */}
        <div className="flex justify-end mt-4">
          <button
            className="text-red-500 px-4 py-1 mr-2 rounded border-2 border-red-500 font-bold text-base hover:bg-red-500 hover:text-white"
            disabled={loading}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-1 rounded text-base"
            disabled={loading}
            onClick={handleSaveChanges}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSupplierPopup;

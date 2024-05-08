import React, { useState, ChangeEvent } from "react";
import { toast } from 'react-toastify';
import PhoneInput from "react-phone-number-input";
import { roleData } from "../DropDownData/DropDownData";
import { categoriesData } from "../DropDownData/DropDownData";
import { postJSONData } from "../Service/apiService";
import { ROLE_ADMIN, ROLE_USER, ROLE_SUPPLIER, TYPE_SUPPLIER, TYPE_USER } from "../Constants/api";

interface AddUserPopupProps {
  onClose: () => void;
}

const AddUserPopup: React.FC<AddUserPopupProps> = ({ onClose }) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [userType, setUserType] = useState(TYPE_USER);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
    supplierName: "",
    supplierType: 3,
    userRole: 1,
    description: "",
  });

  const handleUserTypeChange = (type: string) => {
    setUserType(type);
  };

  const handleSupplierTypeChange = (subcategoryID: number) => {
    setFormData((prevData) => ({ ...prevData, supplierType: subcategoryID }));
  };
  
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Check if the field being updated is the supplierType
    if (name === "supplierType") {
      handleSupplierTypeChange(Number(value));
    } else {
      // Existing logic for other fields
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const validateEmail = (email: string): boolean => {
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handlePhoneChange = (phone: string) => {
    console.log(phone);
    setFormData((prevData) => ({ ...prevData, ['mobileNumber']: phone}));
    console.log(formData);
  }

  const handleSaveChanges = async () => {
    setIsDisabled(true);

    const isValidEmail = validateEmail(formData.emailAddress);
    if (!isValidEmail) {
      setEmailError("Invalid email address");
      setIsDisabled(false);
      return; // Stop execution if email is not valid
    }

    try {
      const response = await postJSONData(`user/`, {
        firstName: formData?.firstName || null,
        lastName: formData?.lastName || null,
        email: formData?.emailAddress || null,
        phone: formData?.mobileNumber || null,
        password: formData?.password || null,
        confirmPassword: formData?.confirmPassword || null,
        role: userType === TYPE_USER ? formData?.userRole  : ROLE_SUPPLIER,
        type: userType === TYPE_SUPPLIER ? formData?.supplierType || null : null,
        supplierName: userType === TYPE_USER ? null : formData?.supplierName || null,
        supplierDesc: userType === TYPE_USER ? null : formData?.description || null
      });

      if (response) {
        onClose();
      }
    } catch (error) {
      toast.error(`Soemthing went wrong! ${error}`);
    }
    
    setIsDisabled(false);
  };

  const [emailError, setEmailError] = useState("");


  return (
    <div className="fixed inset-0 overflow-y-auto bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-md w-[600px]">
        <div className="flex flex-row items-center justify-center mb-4">
          <div className="text-xl font-bold">Add New User</div>
        </div>

        {/* User Type Selection Buttons */}
        <div className="mb-2 flex items-center gap-2 w-full justify-center pb-4">
          <button
            className={`rounded py-[6px] px-8 text-sm text-gray-400 leading-tight focus:outline-none 
                    border border-neutral-400 border-opacity-20 ${
                      userType === TYPE_USER
                        ? "bg-blue-500 text-white"
                        : "shadow border-none"
                    }`}
            onClick={() => handleUserTypeChange(TYPE_USER)}
          >
            User
          </button>
          <button
            className={` py-[6px] rounded px-8 text-sm text-gray-400 leading-tight focus:outline-none 
                    border border-neutral-400 border-opacity-20 ${
                      userType === TYPE_SUPPLIER
                        ? "bg-blue-500 text-white"
                        : "shadow border-none"
                    }`}
            onClick={() => handleUserTypeChange(TYPE_SUPPLIER)}
          >
            Supplier
          </button>
        </div>

        {/* Two-Column Input Fields */}
        <div className=" flex flex-row gap-6 w-full">
          <div className="w-1/2 flex flex-col gap-4">
            <div className="mb-2">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="firstName"
              >
                First Name
              </label>
              <input
                type="text"
                placeholder="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="appearance-none text-xs rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none 
                        border border-neutral-400 border-opacity-20"
                tabIndex={1}
              />
            </div>
            <div className="mb-2">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="emailAddress"
              >
                Email Address
              </label>
              <input
                type="email"
                placeholder="Email Address"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleChange}
                className="appearance-none text-xs rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none 
                        border border-neutral-400 border-opacity-20"
                tabIndex={3}
              />
              {emailError && <div className="text-red-500 text-xs mt-1">{emailError}</div>}
            </div>
            {userType === TYPE_USER && (
              <div className="mb-2">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="userRole"
                >
                  User Role
                </label>
                <div className="relative">
                  <select
                    name="userRole"
                    value={formData.userRole}
                    onChange={handleChange}
                    className="appearance-none text-xs rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none 
                          border border-neutral-400 border-opacity-20"
                    tabIndex={5}
                  >
                    {roleData.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            )}
            {userType === TYPE_SUPPLIER && (
              <div className="w-full flex flex-col gap-4">
                <div className="mb-2">
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="supplierName"
                  >
                    Supplier Name
                  </label>
                  <input
                    type="text"
                    placeholder="Supplier Name"
                    name="supplierName"
                    value={formData.supplierName}
                    onChange={handleChange}
                    className="appearance-none text-xs rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none 
                        border border-neutral-400 border-opacity-20"
                    tabIndex={5}
                  />
                </div>
                <div className="mb-2">
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="supplierType"
                  >
                    Supplier Type
                  </label>
                  <div className="relative">
                    <select
                      name="supplierType"
                      value={formData.supplierType}
                      onChange={handleChange}
                      className="appearance-none text-xs rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none 
                          border border-neutral-400 border-opacity-20"
                      tabIndex={6}
                    >
                      {/* Sample Supplier Type Options */}
                      {Object.values(categoriesData).map((category) => (
                        <optgroup key={category.id} label={category.name}>
                          {category.subcategories.map((subcategory) => (
                            <option key={subcategory.id} value={subcategory.id}>
                              {subcategory.name}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none cuspo">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="description"
                  >
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full  p-3 border rounded h-28 text-gray-400 text-sm font-medium  focus:ring-1 focus:ring-gray-400 focus:outline-none "
                    rows={3} // You can adjust the number of rows as needed
                    tabIndex={7}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="w-1/2 flex flex-col gap-4">
            <div className="mb-2">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="lastName"
              >
                Last Name
              </label>
              <input
                type="text"
                placeholder="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="appearance-none text-xs rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none 
                        border border-neutral-400 border-opacity-20"
                tabIndex={2}
              />
            </div>
            <div className="mb-2">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="mobileNumber"
              >
                Mobile Number
              </label>
              <PhoneInput
                required
                international
                name="phone"
                defaultCountry="IT" // Set the default country (change as needed)
                value={formData.mobileNumber}
                onChange={(value) => handlePhoneChange(value as string)} // Explicitly cast value as string
                className="w-full px-3 py-[6px] border rounded text-gray-400 text-sm font-medium focus:ring-1 focus:ring-gray-400 focus:outline-none border-neutral-400 border-opacity-20"
                tabindex={4}
              />
            </div>
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
                value={formData.password}
                onChange={handleChange}
                className="appearance-none text-xs rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none 
                        border border-neutral-400 border-opacity-20"
                tabIndex={8}
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
                value={formData.confirmPassword}
                onChange={handleChange}
                className="appearance-none text-xs rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none 
                        border border-neutral-400 border-opacity-20"
                tabIndex={9}
              />
            </div>
          </div>
        </div>

        {/* Supplier-Specific Fields */}

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
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserPopup;

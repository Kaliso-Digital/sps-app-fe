import React, { useState, ChangeEvent, useEffect } from "react";
import { Button, Typography } from "@mui/material";
import PhoneInput from "react-phone-number-input";
import { toast } from 'react-toastify';
import { fetchData, putFormData } from "../../Service/apiService";
import { useUserStore } from "../../Service/userStore";
import { Country, State, City } from 'country-state-city';
import Cookies from "js-cookie";
import { categoriesData } from "../../DropDownData/DropDownData";
import User from "../../Interface/User";
import { usePermissions } from "../../Service/PermissionsContext";
import { hasPermission } from "../../Service/utils";
import { ROLE_SUPPLIER,ROLE_CUSTOMER,TYPE_PRIVATE,TYPE_COMPANY } from "../../Constants/api";
import { makeRequest } from "../../Service/api";
import ProfileEditButtons from "./ProfileEditMode";

const createInitialState = () => ({
  avatar: '',
  email: '',
  phone: '',
  firstName: '',
  lastName: '',
  iban: '',
  idNumber: '',
  pecEmail: '',
  sdiNumber: '',
  taxNumber: '',
  id: null,
  is_suspended: null,
  is_verified: null,
  role: {
    id: null,
    name: '',
  },
  supplier: {
    categoryId: 0,
    categoryName: '',
    description: '',
    id: null,
    name: '',
  },
  type: {
    id: 0,
    name: ''
  },
  location: {
    country: '',
    province: '',
    city: '',
    zipcode: '',
    address: ''
  }
});

const Profile = () => {
  const { userPermissions } = usePermissions();
  const [editMode, setEditMode] = useState(false);
  // const setUser = useUserStore((state) => state.setUserData);

  const userData = useUserStore((state) => state.userData);

  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(createInitialState());
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    iban: '',
    supplierName: '',
    supplierDescription: '',
    supplierCategory: 0,
    idNumber: '',
    pecEmail: '',
    sdiNumber: '',
    taxNumber: '',
    password: '',
    confirmPassword: '',
    country: '',
    province: '',
    city: '',
    address: '',
    zipcode: '',
    avatar: null,
    role: null,
    supplier: null,
    is_suspended: 0,
    is_verified: 1
  });

  const countries = Country.getAllCountries();
  const states = profileData.country ? State.getStatesOfCountry(profileData.country) : [];
  const cities = profileData.province ? City.getCitiesOfState(profileData.country as string, profileData.province) : [];

  const fetchProfile = async () => {
    try {
      // const responseData = await makeRequest('get',
      //                                        'profile')
      const responseData = await fetchData(`profile`)
      if (responseData) {
        setProfileData(prevData => ({
          ...prevData,
          firstName: responseData.data.firstName,
          lastName: responseData.data.lastName,
          email: responseData.data.email,
          phone: responseData.data.phone,
          iban: responseData.data.iban,
          idNumber: responseData.data.idNumber,
          sdiNumber: responseData.data.sdiNumber,
          taxNumber: responseData.data.taxNumber,
          pecEmail: responseData.data.pecEmail,
          supplierName: responseData.data.supplier.name,
          supplierCategory: responseData.data.supplier.categoryId,
          supplierDescription: responseData.data.supplier.description,
          country: responseData.data.location.country || null,
          province: responseData.data.location.province || null,
          city: responseData.data.location.city || null,
          address: responseData.data.location.address || null,
          zipcode: responseData.data.location.zipcode || null,
          avatar: responseData.data.avatar || null,
          is_suspended: responseData.data.is_suspended || null,
          is_verified: responseData.data.is_suspended || null,
          role: responseData.data.role || null,
          supplier: responseData.data.supplier || null,
          permissions: responseData.data.permissions || null
        }))
        setUser(responseData.data);
      }
    } catch (error) {
      toast.error(`Something went wrong! ${error}`);
    } finally {
      
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateUserAndLocalStorage = (newUserData: User) => {
    // localStorage.setItem("userData", JSON.stringify(newUserData));
    useUserStore.setState({ userData: newUserData });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePhoneInputChange = (value? : string) => {
    let name = 'phone';
    setProfileData((prevData) => ({
      ...prevData,
      name: value,
    }));
  }
  
  const handleSaveChanges = async () => {
    // Implement logic to save changes

    if (userData) {
      const newUserData: User = {
        firstName: profileData.firstName || userData.firstName,
        lastName: profileData.lastName || userData.lastName,
        email: profileData.email || userData.email,
        phone: profileData.phone || userData.phone,
        iban: profileData.iban || userData.iban,
        idNumber: profileData.idNumber || userData.idNumber,
        sdiNumber: profileData.sdiNumber || userData.sdiNumber,
        taxNumber: profileData.taxNumber || userData.taxNumber,
        pecEmail: profileData.pecEmail || userData.pecEmail,
        avatar: selectedImage
          ? URL.createObjectURL(selectedImage)
          : userData.avatar || "",
        id: userData.id,
        is_suspended: profileData.is_suspended,
        is_verified: profileData.is_verified,
        permissions: [],
        role: userData.role,
        supplier: userData.supplier,
        token: userData.token,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
        location: userData.location
      };

      try {
        // Update local storage
        localStorage.setItem("userData", JSON.stringify(newUserData));

        // Update state
        useUserStore.setState({ userData: newUserData });

        // Get the access token from cookies
        const token = Cookies.get("_auth") || "";

        // Create FormData
        let formData = new FormData();
        formData.append("firstName", profileData.firstName);
        formData.append("lastName", profileData.lastName);
        formData.append("email", profileData.email);
        formData.append("phone", profileData.phone);
        // Additional Information
        if (profileData.sdiNumber){
          formData.append("sdiNumber", profileData.sdiNumber);
        }
        if (profileData.taxNumber){
          formData.append("taxNumber", profileData.taxNumber);
        }
        if (profileData.pecEmail){
          formData.append("pecEmail", profileData.pecEmail);
        }
        if (profileData.idNumber){
          formData.append("idNumber", profileData.idNumber);
        }
        if (profileData.iban){
          formData.append("iban", profileData.iban);
        }
        // Location
        if (profileData.address){
          formData.append("address", profileData.address);
          formData.append("zipcode", profileData.zipcode);
          formData.append("country", profileData.country);
          formData.append("province", profileData.province);
          formData.append("city", profileData.city);
        }
        // Supplier
        if (profileData.supplierName){
          formData.append("name", profileData.supplierName);
        }
        if (profileData.supplierDescription){
          formData.append("description", profileData.supplierDescription);
        }
        if (profileData.supplierCategory){
          formData.append("categoryId", profileData.supplierCategory.toString());
        }
        
        if (profileData.password) {
          formData.append("password", profileData.password);
        }
        if (profileData.confirmPassword) {
          formData.append("confirmpassword", profileData.confirmPassword);
        }

        if(userData.avatar === (selectedImage ? URL.createObjectURL(selectedImage) : '')
            && userData.avatar != ''){
          formData.append("avatar", "null");
        }else
        {
          if (selectedImage instanceof Blob) {
            formData.append("avatar", selectedImage);
          }
        }
        
        console.log('Logging Form Data')
        console.log(formData.get('firstName'))
        console.log(formData.get('lastName'))
        const responseData = await makeRequest('put',
                                               `update-profile`,
                                               formData);

        if (responseData.result) {
          fetchProfile();
          // setUser()
          // useUserStore.setState({ userData: newUserData});

          setEditMode(false);
        }
      } catch (error) {
        toast.error(`Something went wrong! ${error}`)
      }
    }
  };

  const handleCancelChanges = () => {
    // Re-fetch user data from local storage
    fetchProfile();
    // const localUserData = JSON.parse(localStorage.getItem("userData") || "{}");

    // // Update state variables with the fetched data
    // setProfileData(prevData => ({
    //   ...prevData,
    //   firstName: localUserData.firstName || '',
    //   lastName: localUserData.lastName || '',
    //   email: localUserData.email || '',
    //   phone: localUserData.phone || '',
    //   iban: localUserData.iban || '',      
    // }))


    // Clear selected image
    setSelectedImage(null);
    // Exit edit mode
    setEditMode(false);
  };

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleRemoveImage = () => {
    // Clear the selected image and avatar in local storage
    setSelectedImage(null);

    if (userData) {
      const newUserData: User = {
        ...userData,
        avatar: "", // Set the avatar to an empty string
      };

      updateUserAndLocalStorage(newUserData);
    }
  };

  const renderImagePreview = () => {
    if (selectedImage) {
      return (
        <img
          src={URL.createObjectURL(selectedImage)}
          alt="Selected"
          className="uploaded-image w-24 h-24"
          width="50"
        />
      );
    } else if (userData && userData.avatar) {
      return (
        <img
          src={userData.avatar}
          alt="Profile"
          className="uploaded-image w-24 h-24"
          width="50"
        />
      );
    } else {
      return (
        <>
          <div className="add-icon pb-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-[#0D8FFD]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </div>
          <div className="upload-text">
            Upload
            <br />
            Picture
          </div>
        </>
      );
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (editMode) {
      const selectedFile = e.target.files && e.target.files[0];
      setSelectedImage(selectedFile || null);
    }
  };

  return (
    <>
      <div className="w-full py-8 h-[90vh]">
        <div
          className=" rounded-[10px]  h-full  flex flex-col"
          style={{
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div className="inquiry-table-header flex flex-row justify-between items-center w-full p-3 pb-6 gap-4 ">
            <div className="heading font-bold text-2xl">Edit Profile</div>
            <ProfileEditButtons
              editMode={editMode}
              handleCancelChanges={handleCancelChanges}
              handleSaveChanges={handleSaveChanges}
              setEditMode={setEditMode}
            />
          </div>
          <div className="flex flex-col px-5 pb-4 h-full w-full overflow-y-auto">
            <span className="text-sm font-medium pb-1">Upload Picture</span>
            <label
              htmlFor="imageUpload"
              className="image-upload-label flex justify-center items-center w-28 h-28 p-3 mb-2  border-[3px] border-dashed rounded text-sm font-medium focus:ring-1 focus:ring-gray-400 focus:outline-none"
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
              <div className="w-full items-center justify-start text-sm text-red-400 pl-2 pb-4">
                <button
                  onClick={handleRemoveImage}
                  className="remove-image-button"
                >
                  Remove Picture
                </button>
              </div>
            )}

            <div className="profile-details w-3/5">
              <div className="flex flex-row gap-4">
                <div className="flex flex-col w-full pb-4">
                  <span className="text-sm font-medium pb-1">First Name</span>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={profileData.firstName}
                    onChange={handleInputChange}
                    className="w-full  p-3 border rounded bg-white text-gray-400 text-sm font-medium focus:ring-1 focus:ring-gray-400 focus:outline-none "
                    disabled={!editMode}
                  />
                </div>
                <div className="flex flex-col w-full pb-4">
                  <span className="text-sm font-medium pb-1">Last Name</span>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={profileData.lastName}
                    onChange={handleInputChange}
                    className="w-full  p-3 border rounded bg-white text-gray-400 text-sm font-medium focus:ring-1 focus:ring-gray-400 focus:outline-none "
                    disabled={!editMode}
                  />
                </div>
              </div>

              <div className="flex flex-col w-full mb-4">
                <span className="text-sm font-medium pb-1">Email Address</span>
                <input
                  type="text"
                  name="email"
                  placeholder="Email Address"
                  value={profileData.email}
                  onChange={handleInputChange}
                  className="w-full  p-3 border rounded bg-white text-gray-400 text-sm font-medium focus:ring-1 focus:ring-gray-400 focus:outline-none "
                  disabled={!editMode}
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="mobileNumber"
                >
                  Mobile Number
                </label>
                <PhoneInput
                  international
                  defaultCountry="IT" // Set the default country (change as needed)
                  value={profileData.phone}
                  name="phone"
                  onChange={(value) => handlePhoneInputChange(value as string)} // Explicitly cast value as string
                  className="w-full p-3 border rounded text-gray-400 text-sm font-medium focus:ring-1 focus:ring-gray-400 focus:outline-none border-neutral-400 border-opacity-20"
                  disabled={!editMode}
                />
              </div>
              
              {user.role.id == ROLE_SUPPLIER && (
                <>
                  <div className="flex flex-col w-full pb-4">
                    <span className="text-sm font-medium pb-1">Supplier Name</span>
                    <input
                      type="text"
                      name="supplierName"
                      placeholder="Supplier Name"
                      value={profileData.supplierName}
                      onChange={handleInputChange}
                      className="w-full  p-3 border rounded bg-white text-gray-400 text-sm font-medium focus:ring-1 focus:ring-gray-400 focus:outline-none "
                      disabled={!editMode}
                    />
                  </div>
                  
                  <div className="flex flex-col w-full pb-4">
                    <span className="text-sm font-medium pb-1">Supplier Type</span>
                    <select
                      name="supplierCategory"
                      value={profileData.supplierCategory}
                      onChange={handleInputChange}
                      className="appearance-none text-xs rounded w-full p-3 text-gray-700 leading-tight focus:outline-none 
                          border border-neutral-400 border-opacity-20"
                      disabled={!editMode}
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
                  </div>

                  <div className="flex flex-col w-full pb-4">
                    <span className="text-sm font-medium pb-1">Supplier Description</span>
                    <textarea
                    name="supplierDescription"
                    value={profileData.supplierDescription}
                    onChange={handleInputChange}
                    className="w-full  p-3 border rounded h-28 text-gray-400 text-sm font-medium  focus:ring-1 focus:ring-gray-400 focus:outline-none "
                    rows={3}
                    disabled={!editMode}
                  />
                  </div>
                </>
              )}

              {user.role.id == ROLE_CUSTOMER && (
                <>
                  <div className="flex flex-row gap-4">
                    <div className="flex flex-col w-full pb-4">
                      <span className="text-sm font-medium pb-1">Address</span>
                      <input
                        type="text"
                        placeholder="Address"
                        value={profileData.address}
                        onChange={handleInputChange}
                        className="w-full  p-3 border rounded bg-white text-gray-400 text-sm font-medium focus:ring-1 focus:ring-gray-400 focus:outline-none "
                        disabled={!editMode}
                      />
                    </div>
                  </div>
                  <div className="flex flex-row gap-4">
                    <div className="flex flex-col w-full pb-4">
                      <span className="text-sm font-medium pb-1">Country *</span>
                      <select
                        id="country"
                        name="country"
                        value={profileData.country}
                        onChange={handleInputChange}
                        className="appearance-none rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none 
                        border border-neutral-400 border-opacity-20"
                        disabled={!editMode}
                        required
                      >
                        <option value="">Select a Country</option>
                        {countries.map((country) => (
                          <option key={country.isoCode} value={country.isoCode}>{country.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col w-full pb-4">
                      <span className="text-sm font-medium pb-1">Province/State *</span>
                      <select
                        id="province"
                        name="province"
                        value={profileData.province}
                        onChange={handleInputChange}
                        className="appearance-none rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none 
                        border border-neutral-400 border-opacity-20"
                        disabled={!editMode}
                        required
                      >
                        <option value="">Select a Province/State</option>
                        {states.map((state) => (
                          <option key={state.isoCode} value={state.isoCode}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex flex-row gap-4">
                    <div className="flex flex-col w-full pb-4">
                      <span className="text-sm font-medium pb-1">City *</span>
                      <select
                        id="city"
                        name="city"
                        value={profileData.city || ''}
                        onChange={handleInputChange}
                        className="appearance-none rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none 
                        border border-neutral-400 border-opacity-20"
                        disabled={!editMode}
                        required
                      >
                        <option value="">Select a city</option>
                        {cities.map((city) => (
                          <option key={city.name} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col w-full pb-4">
                      <span className="text-sm font-medium pb-1">Zipcode *</span>
                      <input
                        type="text"
                        name="zipcode"
                        placeholder="Zipcode"
                        value={profileData.zipcode}
                        onChange={handleInputChange}
                        className="w-full  p-3 border rounded bg-white text-gray-400 text-sm font-medium focus:ring-1 focus:ring-gray-400 focus:outline-none "
                        disabled={!editMode}
                      />
                    </div>
                  </div>

                  <div className="flex flex-row gap-4">
                    <div className="flex flex-col w-full pb-4">
                      <span className="text-sm font-medium pb-1">ID Number</span>
                      <input
                        type="text"
                        placeholder="ID Number"
                        value={profileData.idNumber}
                        onChange={handleInputChange}
                        className="w-full  p-3 border rounded bg-white text-gray-400 text-sm font-medium focus:ring-1 focus:ring-gray-400 focus:outline-none "
                        disabled={!editMode}
                      />
                    </div>
                    <div className="flex flex-col w-full pb-4">
                      <span className="text-sm font-medium pb-1">IBAN (For Cash on Delivery)</span>
                      <input
                        type="text"
                        placeholder="IBAN"
                        value={profileData.iban}
                        onChange={handleInputChange}
                        className="w-full  p-3 border rounded bg-white text-gray-400 text-sm font-medium focus:ring-1 focus:ring-gray-400 focus:outline-none "
                        disabled={!editMode}
                      />
                    </div>
                  </div>
                  {user.type.id == TYPE_PRIVATE && (
                    <>
                      <div className="flex flex-row gap-4">
                        <div className="flex flex-col w-full pb-4">
                          <span className="text-sm font-medium pb-1">SDI Number</span>
                          <input
                            type="text"
                            placeholder="SDI Number"
                            value={profileData.sdiNumber}
                            onChange={handleInputChange}
                            className="w-full  p-3 border rounded bg-white text-gray-400 text-sm font-medium focus:ring-1 focus:ring-gray-400 focus:outline-none "
                            disabled={!editMode}
                          />
                        </div>
                        <div className="flex flex-col w-full pb-4">
                          <span className="text-sm font-medium pb-1">Tax Number</span>
                          <input
                            type="text"
                            placeholder="Tax Number"
                            value={profileData.taxNumber}
                            onChange={handleInputChange}
                            className="w-full  p-3 border rounded bg-white text-gray-400 text-sm font-medium focus:ring-1 focus:ring-gray-400 focus:outline-none "
                            disabled={!editMode}
                          />
                        </div>
                        <div className="flex flex-col w-full pb-4">
                          <span className="text-sm font-medium pb-1">PEC Email Address</span>
                          <input
                            type="text"
                            placeholder="PEC Email Address"
                            value={profileData.pecEmail}
                            onChange={handleInputChange}
                            className="w-full  p-3 border rounded bg-white text-gray-400 text-sm font-medium focus:ring-1 focus:ring-gray-400 focus:outline-none "
                            disabled={!editMode}
                          />
                        </div>
                      </div>
                    </>
                  )}
                  {user.type.id == TYPE_COMPANY && (
                    <>
                    </>
                  )}
                </>
              )}

              {editMode && (
                <div className="flex flex-col w-full mb-4">
                  <span className="text-sm font-medium pb-1">Password</span>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={profileData.password}
                    onChange={handleInputChange}
                    className="w-full  p-3 bg-white border rounded text-gray-400 text-sm font-medium focus:ring-1 focus:ring-gray-400 focus:outline-none "
                    disabled={!editMode}
                  />
                </div>
              )}
              {editMode && (
                <div className="flex flex-col w-full mb-4">
                  <span className="text-sm font-medium pb-1">
                    Confirm Password
                  </span>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={profileData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full  p-3 border rounded bg-white text-gray-400 text-sm font-medium focus:ring-1 focus:ring-gray-400 focus:outline-none "
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;

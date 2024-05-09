import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useIsAuthenticated } from "react-auth-kit";
import { Country, State, City } from 'country-state-city';
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import PrimaryButton from "../Components/PrimaryButton";
import PrimaryButtonOutlined from "../Components/PrimaryButtonOutlined";
import HollowButton from "../Components/HollowButton";
import { TYPE_COMPANY, TYPE_PRIVATE } from "../Constants/api";
import { makeRequest } from "../Service/api";

const mockSignInWithGoogle = async (): Promise<void> => {
  // Mocking a simple authentication process with Google (replace this with your actual Google authentication logic)
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock successful sign-in with Google
      resolve();
    }, 1000); // Simulating a delay for the asynchronous process
  });
};

const Register = () => {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  if (isAuthenticated()) {
    // Redirect to Dashboard
    navigate('/inquiries');
  }
  
  const [step, setStep] = useState(1);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    clientType: TYPE_COMPANY,
    sdiNumber: '',
    taxNumber: '',
    idNumber: '',
    pecEmail: '',
    iban: '',
    acceptTerms: false,
    subscribeNewsletter: false,
    password: '',
    confirmPassword: '',
    country: '',
    province: '' || null,
    city: '' || null,
    address: '',
    zipCode: ''
  })
  const [signupMandotoryFieldsError, setSignupMandotoryFieldsError] = useState("");
  // Password Errors
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(false);
  const [mandotoryFieldsError, setMandotoryFieldsError] = useState("");

  const countries = Country.getAllCountries();
  const states = formData.country ? State.getStatesOfCountry(formData.country) : [];
  const cities = formData.province ? City.getCitiesOfState(formData.country, formData.province) : [];
  const backgroundImageUrl = 'url("../Assets/onboarding/SignUpBackground.jpeg")';

  const handleSignInWithGoogle = async () => {
    try {
      // Use your authentication library to sign in with Google
      await mockSignInWithGoogle();
    } catch (error) {
      console.error("Error signing in with Google:", error as Error);
    }
  };

  useEffect(() => {

  }, [formData.clientType]);

  const updateNextButtonDisabled = () => {
    setIsNextButtonDisabled(
      !formData.firstName || !formData.phone || !formData.email || !formData.password || !formData.confirmPassword
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type == 'checkbox') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (type == 'select-one') {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value
        }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handlePhoneInputChange = (value: string | undefined) => {
    setFormData((prevData) => ({
      ...prevData,
      ['phone']: value ?? '',
    }));
  };

  const handleNext = () => {
    // Check if mandatory fields are filled
    if (
      !formData.firstName ||
      !formData.phone ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setMandotoryFieldsError("Please fill in all mandatory fields.");
      setIsNextButtonDisabled(true);
      return;
    }

    // Password Validation
    if (formData.password !== formData.confirmPassword) {
      setPasswordMatchError("Passwords do not match.");
      setIsNextButtonDisabled(true);
      return;
    }

    // Reset the password match error if the passwords match
    setPasswordMatchError("");
    updateNextButtonDisabled();

    // If everything is valid, proceed to the next step
    setStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Password strength validation (minimum 8 characters with at least one uppercase, one lowercase, one number, and one special character)
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(value)) {
      setPasswordError(
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
    } else {
      setPasswordError("");
    }

    // Update password state
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear the password match error when typing
    setPasswordMatchError("");
    updateNextButtonDisabled();
  };

  const handleSignUp = async () => {
    try {
      // Validate the form data here if needed
      // Additional validations
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword || !formData.acceptTerms) {
        setMandotoryFieldsError("Please fill in all mandatory fields.");
        return;
      }
  
      if (formData.password !== formData.confirmPassword) {
        setPasswordMatchError("Passwords do not match.");
        return;
      }
  
      // Reset previous errors
      setMandotoryFieldsError("");
      setPasswordMatchError("");
      setPasswordError("");
  
      // Request body
      const responseData = await makeRequest('post',
                                              'register',
                                              formData);
      
      if (responseData.result) {
        navigate('/'); // Redirect to Login
      }
    } catch (error) {
      toast.error(`Something went wrong! ${error}`);
    }
  };

  return (
    <div
      className="flex font-satoshi overflow-y-auto"
      style={{
        backgroundImage: backgroundImageUrl,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <ToastContainer />
      <div className="flex flex-row justify-end items-center h-screen w-full mr-[15%] overflow-y-auto">
        <form className="bg-white shadow rounded p-4 mb-2 w-96">
          {step === 1 && (
            <>
              <div className="flex flex-row w-full justify-between items-center mb-4">
                <span className="text-xl font-bold">Sign up</span>
                <span className="text-xs font-bold">1/2 steps</span>
              </div>
              <div className="flex flex-row gap-2">
                <div className="mb-2">
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="firstName"
                  >
                    First Name *
                  </label>
                  <input
                    className="appearance-none rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none
                    border border-neutral-400 border-opacity-20"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-2">
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="lastName"
                  >
                    Last Name
                  </label>
                  <input
                    className="appearance-none rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none 
                        border border-neutral-400 border-opacity-20"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="mb-2">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="email"
                >
                  Email Address *
                </label>
                <input
                  className="appearance-none rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none 
                        border border-neutral-400 border-opacity-20"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="phone"
                >
                  Phone Number *
                </label>
                <PhoneInput
                  required
                  international
                  name="phone"
                  defaultCountry="IT" // Set the default country (change as needed)
                  value={formData.phone}
                  onChange={handlePhoneInputChange} // Explicitly cast value as string
                  className="w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none border border-neutral-400 border-opacity-20"
                />
              </div>

              <div className="mb-2 relative">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="password"
                >
                  Password *
                </label>
                <div className="relative">
                  <input
                    className="appearance-none rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none 
                    border border-neutral-400 border-opacity-20 pr-10"
                    name="password"
                    type={passwordVisible ? "text" : "password"}
                    value={formData.password}
                    onChange={handlePasswordChange}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke={passwordVisible ? "blue" : "currentColor"}
                      className="w-4 h-4 transition-colors duration-300 ease-in-out"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>
                </div>
                {passwordError && (
                  <div className="text-sm text-red-500 mt-1">
                    {passwordError}
                  </div>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="mb-2 relative">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="confirmPassword"
                >
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    className={`appearance-none rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none 
              border border-neutral-400 border-opacity-20 pr-10 ${
                passwordMatchError ? "border-red-500" : ""
              }`}
                    name="confirmPassword"
                    type={confirmPasswordVisible ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      handlePasswordChange(e);
                      setPasswordMatchError(""); // Clear the error when typing
                      updateNextButtonDisabled();
                    }}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() =>
                      setConfirmPasswordVisible(!confirmPasswordVisible)
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke={confirmPasswordVisible ? "blue" : "currentColor"}
                      className="w-4 h-4 transition-colors duration-300 ease-in-out"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>
                </div>
                {passwordMatchError && (
                  <p className="text-red-500 text-xs mt-1">
                    {passwordMatchError}
                  </p>
                )}
              </div>

              <div className="mt-5 flex flex-col gap-3 mb-6">
                <PrimaryButton onClick={handleNext} text="Next" buttonType="button" disabled={isNextButtonDisabled} fullWidth={true}/>
                {mandotoryFieldsError && (
                  <p className="text-red-500 text-xs mt-1">
                    {mandotoryFieldsError}
                  </p>
                )}
                <PrimaryButtonOutlined onClick={() => navigate('/')} text="Already have an account? Login here" buttonType="button"/>
              </div>

              <div className="w-full flex items-center justify-center text-center mt-4 ">
                <hr className="flex-grow border-t border-gray-300 mr-4" />
                <span className="text-xs font-medium text-center">OR</span>
                <hr className="flex-grow border-t border-gray-300 ml-4" />
              </div>
              <div className="mt-6 w-full flex flex-col items-center justify-center">
                <img
                  className="w-6 h-6 "
                  src="./Assets/onboarding/search.png"
                  alt="Google Logo"
                />
                <HollowButton onClick={handleSignInWithGoogle} text="Sign In with Google" buttonType="button"/>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="flex flex-row items-center justify-between mb-4">
                <div className="flex flex-row items-center justify-center text-center gap-2 ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="#0D8FFD"
                    className="w-6 h-6 items-center justify-center cursor-pointer"
                    onClick={handleBack}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                    />
                  </svg>
                  <div className="text-xl font-bold  items-center justify-center text-center">
                    Sign up
                  </div>
                </div>

                <span className="text-sm">2/2 steps</span>
              </div>

              <div className="mb-2 flex items-center gap-2">
                <div className="flex-grow relative">
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="clientType"
                  >
                    Type of Client
                  </label>
                  <div className="relative">
                    <select
                      className="appearance-none rounded w-full py-[6px] px-3 text-sm text-gray-400 leading-tight focus:outline-none 
                    border border-neutral-400 border-opacity-20"
                      name="clientType"
                      value={formData.clientType}
                      onChange={handleInputChange}
                    >
                      <option value={TYPE_COMPANY}>Company</option>
                      <option value={TYPE_PRIVATE}>Private</option>
                      {/* Add options based on your client types */}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <svg
                        className="h-5 w-5 text-blue-500"
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
              </div>
              
              <div className="flex flex-row gap-2">
                <div className="mb-2">
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="country"
                  >
                    Country *
                  </label>
                  <select
                    name="country"
                    value={formData.country || ''}
                    onChange={handleInputChange}
                    className="appearance-none rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none 
                    border border-neutral-400 border-opacity-20"
                    required
                  >
                    <option value="">Select a Country</option>
                    {countries.map((country) => (
                      <option key={country.isoCode} value={country.isoCode}>{country.name}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-2">
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="province"
                  >
                    Province/State *
                  </label>
                  <select
                    name="province"
                    value={formData.province || ''}
                    onChange={handleInputChange}
                    className="appearance-none rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none 
                    border border-neutral-400 border-opacity-20"
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

              <div className="flex flex-row gap-2">
                <div className="mb-2">
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="city"
                  >
                    City *
                  </label>
                  <select
                    name="city"
                    value={formData.city || ''}
                    onChange={handleInputChange}
                    className="appearance-none rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none 
                    border border-neutral-400 border-opacity-20"
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

                <div className="mb-2">
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="zipCode"
                  >
                    Zip Code *
                  </label>
                  <input
                    className="appearance-none rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none 
              border border-neutral-400 border-opacity-20"
                    name="zipCode"
                    type="text"
                    placeholder=""
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-2">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="address"
                >
                  Address *
                </label>
                <input
                  className="appearance-none rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none 
              border border-neutral-400 border-opacity-20"
                  name="address"
                  type="text"
                  placeholder=""
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {formData.clientType == TYPE_COMPANY && (
                <div className="flex flex-row gap-2">
                  <div className="mb-2">
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="sdiNumber"
                    >
                      SDI Number
                    </label>
                    <input
                      className="appearance-none rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none 
                        border border-neutral-400 border-opacity-20"
                      name="sdiNumber"
                      type="text"
                      placeholder=""
                      value={formData.sdiNumber}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-2">
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="taxNumber"
                    >
                      Tax Number {formData.clientType == TYPE_COMPANY && " *"}
                    </label>
                    <input
                      className="appearance-none rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none 
                        border border-neutral-400 border-opacity-20"
                      name="taxNumber"
                      type="text"
                      placeholder=""
                      value={formData.taxNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              )}
              
              <div className="mb-2">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="idNumber"
                >
                  ID Number {formData.clientType == TYPE_PRIVATE && " *"}
                </label>
                <input
                  className="appearance-none rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none 
                  border border-neutral-400 border-opacity-20"
                  name="idNumber"
                  type="text"
                  placeholder=""
                  value={formData.idNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {formData.clientType == TYPE_COMPANY && (
                <div className="mb-2">
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="pecEmail"
                  >
                    PEC Email Address
                  </label>
                  <input
                    className="appearance-none rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none 
                        border border-neutral-400 border-opacity-20"
                    name="pecEmail"
                    type="email"
                    placeholder=""
                    value={formData.pecEmail}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}
              <div className="mb-2">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="iban"
                >
                  IBAN (For cash on delivery) *
                </label>
                <input
                  className="appearance-none rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none 
                        border border-neutral-400 border-opacity-20"
                  name="iban"
                  type="text"
                  placeholder=""
                  value={formData.iban}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-2">
                <div className="flex items-center">
                  <input
                    className="mr-2 leading-tight "
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleInputChange}
                    required
                  />
                  <label className="text-sm font-normal" htmlFor="acceptTerms">
                  Accept <a href="https://spsfulfillment.com/privacy">Privacy Policy</a> and <a href="https://spsfulfillment.com/terms">Terms and Conditions</a>*
                  </label>
                </div>
              </div>

              <div className="mb-2">
                <div className="flex items-center">
                  <input
                    className="mr-2 leading-tight"
                    type="checkbox"
                    name="subscribeNewsletter"
                    checked={formData.subscribeNewsletter}
                    onChange={handleInputChange}
                  />
                  <label
                    className="text-sm font-normal"
                    htmlFor="subscribeNewsletter"
                  >
                    Subscribe to Our Newsletter
                  </label>
                </div>
              </div>

              <div className="mt-5">
                <button
                  className="w-full text-white text-base font-semibold tracking-wide bg-[#0D8FFD] hover:bg-blue-700 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={handleSignUp}
                >
                  Complete Sign Up
                </button>
                {signupMandotoryFieldsError && (
                  <p className="text-red-500 text-xs mt-1">
                    {signupMandotoryFieldsError}
                  </p>
                )}
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;

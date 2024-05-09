import React, { useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { ToastContainer } from "react-toastify";
import * as yup from "yup";
import SignUpStepTwo from "./SignUpStepTwo";

const validationSchemaStepOne = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone Number is required"),
  password: yup
    .string()
    .required("Password is required")
    .test(
      "password-strength",
      "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      (value) => {
        const passwordStrengthError = checkPasswordStrength(value || "");
        return !passwordStrengthError;
      }
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required")
    .nullable(),
});

const checkPasswordStrength = (password: string): string | null => {
  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }
  if (!/\d/.test(password)) {
    return "Password must contain at least one number.";
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return "Password must contain at least one special character.";
  }
  return null;
};

const mockSignInWithGoogle = async (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
};

const SignUpStepOne = () => {
  const [formDataStepOne, setFormDataStepOne] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [step, setStep] = useState(1);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handleChangeStepOne = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormDataStepOne((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlephoneChange = (value?: string | undefined) => {
    setFormDataStepOne((prevData) => ({
      ...prevData,
      phone: value || "",
    }));
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleBlurStepOne = async (e: React.FocusEvent<HTMLInputElement>) => {
    try {
      await validationSchemaStepOne.validateAt(e.target.name, formDataStepOne);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [e.target.name]: "",
      }));
    } catch (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [e.target.name]: (error as { message: string }).message,
      }));
    }
  };

  const backgroundImageUrl = 'url("../Assets/onboarding/SignUpBackground.jpeg")';

  const handleSignInWithGoogle = async () => {
    try {
      await mockSignInWithGoogle();
    } catch (error) {
      console.error("Error signing in with Google:", error as Error);
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    validationSchemaStepOne
      .validate(formDataStepOne, { abortEarly: false })
      .then(() => {
        setStep((prevStep) => prevStep + 1);
      })
      .catch((validationError) => {
        const newErrors: {
          firstName?: string;
          lastName?: string;
          email?: string;
          phone?: string;
          taxNumber?: string;
          idNumber?: string;
          acceptTerms?: string;
          password?: string;
          confirmPassword?: string;
        } = {};
        validationError.inner.forEach((error: yup.ValidationError) => {
          newErrors[error.path as keyof typeof newErrors] = error.message;
        });

        setErrors((prevErrors) => ({
          ...prevErrors,
          ...newErrors,
        }));
      });
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
        <div className="bg-white shadow rounded p-4 mb-2 w-96">
          {step === 1 && (
            <form onSubmit={handleNext}>
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
                    className={`appearance-none rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none
                    border border-neutral-400 border-opacity-20 ${
                      errors.firstName ? "border-red-500" : ""
                    }`}
                    id="firstName"
                    type="text"
                    placeholder=""
                    value={formDataStepOne.firstName}
                    onChange={handleChangeStepOne}
                    onBlur={handleBlurStepOne}
                    name="firstName"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div className="mb-2">
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="lastName"
                  >
                    Last Name *
                  </label>
                  <input
                    className={`appearance-none rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none
                    border border-neutral-400 border-opacity-20 ${
                      errors.lastName ? "border-red-500" : ""
                    }`}
                    id="lastName"
                    type="text"
                    placeholder=""
                    value={formDataStepOne.lastName}
                    onChange={handleChangeStepOne}
                    onBlur={handleBlurStepOne}
                    name="lastName"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.lastName}
                    </p>
                  )}
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
                  className={`appearance-none rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none
                    border border-neutral-400 border-opacity-20 ${
                      errors.email ? "border-red-500" : ""
                    }`}
                  id="email"
                  type="text"
                  placeholder=""
                  value={formDataStepOne.email}
                  onChange={handleChangeStepOne}
                  onBlur={handleBlurStepOne}
                  name="email"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="phone"
                >
                  Phone Number *
                </label>
                <PhoneInput
                  className={`appearance-none rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none
                border border-neutral-400 border-opacity-20 ${
                  errors.phone ? "border-red-500" : ""
                }`}
                  required
                  international
                  defaultCountry="US"
                  value={formDataStepOne.phone}
                  type="text"
                  id="phone"
                  name="phone"
                  onChange={handlephoneChange}
                  onBlur={handleBlurStepOne}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phone}
                  </p>
                )}
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
                    className={`appearance-none rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none
                    border border-neutral-400 border-opacity-20 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    id="password"
                    type={passwordVisible ? "text" : "password"}
                    placeholder=""
                    value={formDataStepOne.password}
                    onChange={handleChangeStepOne}
                    onBlur={handleBlurStepOne}
                    name="password"
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
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
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
                    border border-neutral-400 border-opacity-20 ${
                      errors.confirmPassword ? "border-red-500" : ""
                    }`}
                    id="confirmPassword"
                    type={confirmPasswordVisible ? "text" : "password"}
                    placeholder=""
                    value={formDataStepOne.confirmPassword}
                    onChange={handleChangeStepOne}
                    onBlur={handleBlurStepOne}
                    name="confirmPassword"
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
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="mt-5">
                <button
                  className="w-full text-white text-base font-semibold tracking-wide bg-[#0D8FFD] hover:bg-blue-700 py-1 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Next
                </button>
              </div>
              <button
                className="w-full text-base  tracking-wide  text-[#0D8FFD] border border-[#0D8FFD]  font-semibold py-1 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
                type="button"
                onClick={() => (window.location.href = "/")}
              >
                Already have an account? Login here
              </button>

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
                <button
                  className="flex items-center text-base font-medium  rounded-md p-2 hover:shadow-md border-none outline-none shadow-none"
                  type="button"
                  onClick={handleSignInWithGoogle}
                >
                  Sign In with Google
                </button>
              </div>
            </form>
          )}
          {step === 2 && <SignUpStepTwo 
          formDataStepOne={formDataStepOne} 
          onBack={handleBack} />}
        </div>
      </div>
    </div>
  );
};

export default SignUpStepOne;

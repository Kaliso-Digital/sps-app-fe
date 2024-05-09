import React, { useState } from "react";
import { toast } from "react-toastify";
import * as yup from "yup";
import { Country, State, City } from "country-state-city";
import { BASEURL, TYPE_COMPANY, TYPE_PRIVATE } from "../Constants/api";
import { useNavigate } from "react-router-dom";

const validationSchemaStepTwoPrivate = yup.object().shape({
  idNumber: yup.string().required("ID Number is required"),
  iban: yup.string().required("IBAN is required"),
  acceptTerms: yup
    .boolean()
    .oneOf([true], "You must accept the terms and conditions"),
});

const validationSchemaStepTwoCompany = yup.object().shape({
  taxNumber: yup.string().required("Tax Number is required"),
  iban: yup.string().required("IBAN is required"),
  acceptTerms: yup
    .boolean()
    .oneOf([true], "You must accept the terms and conditions"),
});

interface StepTwoFormProps {
  formDataStepOne: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  };
}

const SignUpStepTwo: React.FC<StepTwoFormProps & { onBack: () => void }> = ({
  formDataStepOne,
  onBack,
}) => {
  const navigate = useNavigate();
  const [signupError, setSignupError] = useState<string | null>(null);

  const [formDataStepTwo, setFormDataStepTwo] = useState({
    selectedCountry: null,
    selectedState: null,
    selectedCity: null,
    address: "",
    zipCode: "",
    clientType: 1,
    sdiNumber: "",
    taxNumber: "",
    idNumber: "",
    pecEmail: "",
    iban: "",
    acceptTerms: false,
    subscribeNewsletter: false,
  });

  const [errors, setErrors] = useState({
    taxNumber: "",
    idNumber: "",
    acceptTerms: "",
    iban: "",
  });

  const countries = Country.getAllCountries();
  const states = formDataStepTwo.selectedCountry
    ? State.getStatesOfCountry(formDataStepTwo.selectedCountry)
    : [];
  const cities = formDataStepTwo.selectedState
    ? City.getCitiesOfState(
        formDataStepTwo.selectedCountry || "",
        formDataStepTwo.selectedState
      )
    : [];

  const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    try {
      if (formDataStepTwo.clientType === TYPE_PRIVATE) {
        await validationSchemaStepTwoPrivate.validateAt(
          e.target.name,
          formDataStepTwo
        );
      } else {
        await validationSchemaStepTwoCompany.validateAt(
          e.target.name,
          formDataStepTwo
        );
      }
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormDataStepTwo((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormDataStepTwo((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleClientSelectChange = ( e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormDataStepTwo((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: name === "clientType" ? +value : value,
      };

      return updatedData;
    });

    

    setErrors((prevErrors) => ({
      ...prevErrors,
      taxNumber: "",
      idNumber: "",
      acceptTerms: "",
      iban: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);
    try {
      if (formDataStepTwo.clientType === TYPE_PRIVATE) {
        await validationSchemaStepTwoPrivate.validate(formDataStepTwo, {
          abortEarly: false,
        });
      } else {
        await validationSchemaStepTwoCompany.validate(formDataStepTwo, {
          abortEarly: false,
        });
      }

      const formDataStepTwoCopy = { 
        clientType: formDataStepTwo.clientType,
        sdiNumber: formDataStepTwo.clientType === TYPE_PRIVATE ? "" :formDataStepTwo.sdiNumber,
        taxNumber: formDataStepTwo.clientType === TYPE_PRIVATE ? "" :formDataStepTwo.taxNumber,
        idNumber: formDataStepTwo.idNumber,
        pecEmail: formDataStepTwo.clientType === TYPE_PRIVATE ? "" :formDataStepTwo.pecEmail,
        iban: formDataStepTwo.iban,
        country: formDataStepTwo.selectedCountry,
        city: formDataStepTwo.selectedCity,
        province: formDataStepTwo.selectedState,
        address: formDataStepTwo.address,
        zipCode: formDataStepTwo.zipCode,
       };


      const requestData = { ...formDataStepOne, ...formDataStepTwoCopy };

      const response = await fetch(`${BASEURL}register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      if (response.ok) {
        const responseData = await response.json();
        toast.success(
          responseData.message
            ? responseData.message
            : "Your account has been created successfully!"
        );

        navigate("/");
      } else {
        const errorData = await response.json();
        setSignupError(errorData.message);
      }
    } catch (validationError) {
        const newErrors: {
          taxNumber?: string;
          idNumber?: string;
          acceptTerms?: string;
          iban?: string;
        } = {};
      
        // Check if inner is defined and is an array
        if (
          validationError &&
          validationError instanceof yup.ValidationError &&
          validationError.inner &&
          Array.isArray(validationError.inner)
        ) {
          validationError.inner.forEach((error: yup.ValidationError) => {
            newErrors[error.path as keyof typeof newErrors] = error.message;
          });
        }
      
        setErrors((prevErrors) => ({
          ...prevErrors,
          ...newErrors,
        }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setFormDataStepTwo((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-row items-center justify-between mb-4">
        <div className="flex flex-row items-center justify-center text-center gap-2 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="#0D8FFD"
            className="w-6 h-6 items-center justify-center cursor-pointer"
            onClick={() => {
              onBack(); // Call the callback function on back button click
            }}
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
              id="clientType"
              value={formDataStepTwo.clientType}
              onChange={handleClientSelectChange}
              name="clientType"
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

      <div className="flex w-full flex-row gap-2">
        <div className="mb-2 w-1/2">
          <label className="block text-sm font-medium mb-1" htmlFor="country">
            Country
          </label>
          <select
            id="selectedCountry"
            value={formDataStepTwo.selectedCountry || ""}
            onChange={handleSelectChange}
            className="appearance-none rounded w-full py-[6px] px-3 text-gray-400 leading-tight focus:outline-none 
          border border-neutral-400 border-opacity-20 text-sm"
            name="selectedCountry"
          >
            <option value="">Select a Country</option>
            {countries.map((country) => (
              <option key={country.isoCode} value={country.isoCode}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-2 w-1/2">
          <label className="block text-sm font-medium mb-1" htmlFor="province">
            Province/State
          </label>
          <select
            id="selectedState"
            value={formDataStepTwo.selectedState || ""}
            onChange={handleSelectChange}
            className="appearance-none rounded w-full py-[6px] px-3 text-gray-400 leading-tight focus:outline-none 
          border border-neutral-400 border-opacity-20 text-sm"
            name="selectedState"
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

      <div className="flex flex-row w-full gap-2">
        <div className="mb-2 w-1/2 ">
          <label className="block text-sm font-medium mb-1" htmlFor="city">
            City
          </label>
          <select
            id="selectedCity"
            value={formDataStepTwo.selectedCity || ""}
            onChange={handleSelectChange}
            className="appearance-none rounded w-full py-[6px] px-3 leading-tight focus:outline-none 
          border border-neutral-400 border-opacity-20 text-sm text-gray-400"
            name="selectedCity"
          >
            <option value="">Select a city</option>
            {cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-2 w-1/2">
          <label className="block text-sm font-medium mb-1" htmlFor="zipCode">
            Zip Code
          </label>
          <input
            className="appearance-none rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none
            border border-neutral-400 border-opacity-20"
            id="zipCode"
            type="text"
            placeholder=""
            value={formDataStepTwo.zipCode}
            onChange={handleChange}
            name="zipCode"
          />
        </div>
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium mb-1" htmlFor="address">
          Address
        </label>
        <input
          className="appearance-none rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none
            border border-neutral-400 border-opacity-20"
          id="address"
          type="text"
          placeholder=""
          value={formDataStepTwo.address}
          onChange={handleChange}
          name="address"
        />
      </div>

      {formDataStepTwo.clientType === TYPE_COMPANY && (
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
              id="sdiNumber"
              type="text"
              placeholder=""
              value={formDataStepTwo.sdiNumber}
              onChange={handleChange}
              name="sdiNumber"
            />
          </div>

          <div className="mb-2">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="taxNumber"
            >
              Tax Number {formDataStepTwo.clientType === TYPE_COMPANY && " *"}
            </label>
            <input
              className={`appearance-none rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none
              border border-neutral-400 border-opacity-20 ${
                errors.taxNumber ? "border-red-500" : ""
              }`}
              id="taxNumber"
              type="text"
              placeholder=""
              value={formDataStepTwo.taxNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              name="taxNumber"
            />
            {errors.taxNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.taxNumber}</p>
            )}
          </div>
        </div>
      )}

      <div className="mb-2">
        <label className="block text-sm font-medium mb-1" htmlFor="idNumber">
          ID Number {formDataStepTwo.clientType === TYPE_PRIVATE && " *"}
        </label>
        <input
          className={`appearance-none rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none
            border border-neutral-400 border-opacity-20 ${
              errors.idNumber ? "border-red-500" : ""
            }`}
          id="idNumber"
          type="text"
          placeholder=""
          value={formDataStepTwo.idNumber}
          onChange={handleChange}
          onBlur={handleBlur}
          name="idNumber"
        />
        {errors.idNumber && (
          <p className="text-red-500 text-xs mt-1">{errors.idNumber}</p>
        )}
      </div>
      {formDataStepTwo.clientType === TYPE_COMPANY && (
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1" htmlFor="pecEmail">
            PEC Email Address
          </label>
          <input
            className="appearance-none rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none
            border border-neutral-400 border-opacity-20"
            id="pecEmail"
            type="text"
            placeholder=""
            value={formDataStepTwo.pecEmail}
            onChange={handleChange}
            name="pecEmail"
          />
        </div>
      )}
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1" htmlFor="iban">
          IBAN (For cash on delivery) *
        </label>
        <input
          className={`appearance-none rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none
          border border-neutral-400 border-opacity-20 ${
            errors.iban ? "border-red-500" : ""
          }`}
          id="iban"
          type="text"
          placeholder=""
          value={formDataStepTwo.iban}
          onChange={handleChange}
          onBlur={handleBlur}
          name="iban"
        />
        {errors.iban && (
          <p className="text-red-500 text-xs mt-1">{errors.iban}</p>
        )}
      </div>

      <div className="mb-2">
        <div className="flex items-center">
          <input
            className="mr-2 leading-tight"
            type="checkbox"
            id="acceptTerms"
            checked={formDataStepTwo.acceptTerms}
            onBlur={handleBlur}
            onChange={handleCheckboxChange}
            name="acceptTerms"
          />
          <label className="text-sm font-normal" htmlFor="acceptTerms">
            Accept <a href="https://spsfulfillment.com/privacy">Privacy Policy</a> and <a href="https://spsfulfillment.com/terms">Terms and Conditions</a>*
          </label>
        </div>
        {errors.acceptTerms && (
          <p className="text-red-500 text-xs mt-1">{errors.acceptTerms}</p>
        )}
      </div>

      <div className="mb-2">
        <div className="flex items-center">
          <input
            className="mr-2 leading-tight"
            type="checkbox"
            id="subscribeNewsletter"
            checked={formDataStepTwo.subscribeNewsletter}
            onChange={handleCheckboxChange}
            name="subscribeNewsletter"
          />
          <label className="text-sm font-normal" htmlFor="subscribeNewsletter">
            Subscribe to Our Newsletter
          </label>
        </div>
      </div>

      <div className="mt-5">
        <button
          className="w-full text-white text-base font-semibold tracking-wide bg-[#0D8FFD] hover:bg-blue-700 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Complete Sign Up
        </button>
        {signupError && (
          <p className="text-red-500 text-xs mt-1">{signupError}</p>
        )}
      </div>
    </form>
  );
};

export default SignUpStepTwo;

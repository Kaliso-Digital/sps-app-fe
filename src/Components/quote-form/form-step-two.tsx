// QuoteFormStepTwo.jsx
import React, { useState, ChangeEvent, useEffect } from "react";
import { Button } from "@mui/material";
import { useFormikContext } from "formik";
import { QuoteFormValues } from ".";
import Popup from "../../Interface/Popup";
import RedButtonOutlined from "../RedButtonOutlined";
import PrimaryButton from "../PrimaryButton";
import {  VariantQuote } from "../../Interface/Variant";
import { CustomizationQuote } from "../../Interface/Customization";
import Box from "../../Interface/Box";

type Props = {
  goBack: () => void;
};

export const QuoteFormStepTwo: React.FC<Popup> = ({ data, onClose, handleNext, handleBack}) => {
  const {
    values,
    setFieldValue,
    handleChange,
    errors,
    handleBlur,
    handleSubmit,
  } = useFormikContext<QuoteFormValues>();

  const [variants, setVariants] = useState<VariantQuote[]>([]);
  const [customizations, setCustomizations] = useState<CustomizationQuote>();
  const [boxes, setBoxes] = useState<Box[]>([]);

  useEffect(() => {
    console.log(data?.variants);
    setVariants(data?.variants);

    const customizationData: CustomizationQuote = {
      customization: data?.customizations || null,
      price: 0, // Set an initial value or retrieve it from somewhere else
    };

    setCustomizations(customizationData);
    setBoxes([{ height: 0, length: 0, width: 0, weight: 0 }]);    
  }, []);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    setFieldValue("certification", selectedFile);
  };

  const renderFilePreview = () => {
    if (values.certification) {
      return (
        <div className="file-upload-container flex justify-center items-center flex-col">
          <div className="file-name-preview">
            {(values.certification as any)?.name}
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
          <div className="file-upload-text text-center">Upload File</div>
        </div>
      );
    }
  };

  const handleAddBox = () => {
    setFieldValue("noOfBoxes", values.noOfBoxes + 1);
    // Create a new box with all values set to 0
    const newBox: Box = { height: 0, length: 0, width: 0, weight: 0 };

    // Use the spread operator to create a new array with the new box added
    setBoxes((prevBoxes) => [...prevBoxes, newBox]);
  };

  const handleDeleteBox = (index: number) => {
    if (values.noOfBoxes > 1) {
      setFieldValue("noOfBoxes", values.noOfBoxes - 1);
    }

    if (boxes.length > 1) {
      // Use filter to create a new array without the box at the specified index
      setBoxes((prevBoxes) => prevBoxes.filter((_, i) => i !== index));
    }
  };

  const handleBoxWeightChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const weight = parseFloat(event.target.value) || 0;
    const updatedBoxes = [...boxes];
    updatedBoxes[index] = {
      ...updatedBoxes[index],
      weight: weight,
    };
    setBoxes(updatedBoxes);
    setFieldValue("boxes", updatedBoxes);
  }

  const handleBoxHeightChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const height = parseFloat(event.target.value) || 0;
    const updatedBoxes = [...boxes];
    updatedBoxes[index] = {
      ...updatedBoxes[index],
      height: height,
    };
    setBoxes(updatedBoxes);
    setFieldValue("boxes", updatedBoxes);
  }

  const handleBoxWidthChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const width = parseFloat(event.target.value) || 0;
    const updatedBoxes = [...boxes];
    updatedBoxes[index] = {
      ...updatedBoxes[index],
      width: width,
    };
    setBoxes(updatedBoxes);
    setFieldValue("boxes", updatedBoxes);
  }

  const handleBoxLengthChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const length = parseFloat(event.target.value) || 0;
    const updatedBoxes = [...boxes];
    updatedBoxes[index] = {
      ...updatedBoxes[index],
      length: length,
    };
    setBoxes(updatedBoxes);
    setFieldValue("boxes", updatedBoxes);
  }

  const handleCustomizationPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = parseFloat(event.target.value) || 0;
    
    // Update the price property in customizations state
    setCustomizations((prevCustomizations) => ({
      ...prevCustomizations!,
      price: newPrice,
    }));

    setFieldValue("customizations", customizations)
  };

  const handleCustomizationNotPossibleChange = () => {
    setCustomizations((prevCustomizations) => ({
      ...prevCustomizations!,
      notPossible: !customizations?.notPossible,
    }));

    setFieldValue("customizations", customizations)
  }

  const handleCustomizationReasonChange = (reason: string) => {
    setCustomizations((prevCustomizations) => ({
      ...prevCustomizations!,
      reason: reason,
    }));

    setFieldValue("customizations", customizations)
  }

  const handleVariantPriceChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newPrice = parseFloat(event.target.value) || 0;
    const updatedVariants = [...variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      price: newPrice,
    };
    setVariants(updatedVariants);

    setFieldValue("variants", updatedVariants);
  };

  const handleVariantNotPossibleChange = (index: number) => {
    setVariants((prevVariants) => {
      const updatedVariants = [...prevVariants];
      const variant = { ...updatedVariants[index] };

      variant.notPossible = !variant.notPossible;

      // If "Not Possible" is unchecked, clear the reason
      if (!variant.notPossible) {
        variant.reason = null;
      }

      updatedVariants[index] = variant;
      setFieldValue("variants", updatedVariants);
      return updatedVariants;
    });
  };

  const handleNotPossibleReasonChange = (index: number, reason: string) => {
    setVariants((prevVariants) => {
      const updatedVariants = [...prevVariants];
      const variant = { ...updatedVariants[index] };

      variant.reason = reason;
      updatedVariants[index] = variant;
      setFieldValue("variants", updatedVariants);
      return updatedVariants;
    });
  };

  return (
    <>
      <div className="flex flex-col w-full overflow-y">
        <div className="flex flex-row w-full">
          <div
            className={`flex flex-col  w-1/2 p-5 ${
              values.noOfBoxes > 1 ? "" : "justify-between"
            }`}
          >
            <div className="flex flex-col w-full pb-4">
              <span className="text-sm font-bold pb-1">Certification</span>
              <label
                htmlFor="fileUpload"
                className="file-upload-label flex justify-center items-center w-full h-32 p-3 border-[3px] border-dashed rounded text-sm font-medium focus:ring-1 focus:ring-gray-400 focus:outline-none"
              >
                {renderFilePreview()}
                <input
                  type="file"
                  id="fileUpload"
                  accept="file/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex flex-col w-full pb-4 gap-6">
              <div className="flex flex-row w-full gap-4">
                <input
                  type="checkbox"
                  id="batteryCheckbox"
                  checked={values.isBattery}
                  onChange={() => setFieldValue("isBattery", !values.isBattery)}
                />
                <label htmlFor="batteryCheckbox" className="text-md font-bold">Battery</label>
              </div>
              <div className="flex flex-row w-full gap-4">
                <input
                  type="checkbox"
                  id="liquidCheckbox"
                  checked={values.isLiquid}
                  onChange={() => setFieldValue("isLiquid", !values.isLiquid)}
                />
                <label htmlFor="liquidCheckbox" className="text-md font-bold">Liquid</label>
              </div>
              <div className="flex flex-row w-full gap-4">
                <input
                  type="checkbox"
                  id="foodCheckbox"
                  checked={values.isFoodPlant}
                  onChange={() => setFieldValue("isFoodPlant", !values.isFoodPlant)}
                />
                <label htmlFor="foodCheckbox" className="text-md font-bold">Food or Plant Product</label>
              </div>
            </div>

            <div className="flex flex-col w-full pb-4">
              <span className="text-sm font-bold pb-1">Lead Time</span>
              <div className="flex flex-row gap-4 items-center">
                <input
                  type="text"
                  value={values.orderArrival}
                  name="orderArrival"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full p-3 border rounded text-gray-400 text-sm font-medium focus:ring-1 focus:ring-gray-400 focus:outline-none"
                />
                <div>Days</div>
              </div>
            </div>
          </div>

          <div
            className={`flex flex-col  w-1/2 p-5 ${
              values.noOfBoxes > 1 ? "" : "justify-between"
            }`}
          >
            <div className="flex flex-col w-full pb-4">
              <span className="text-sm font-bold pb-1">
                Number of CTN
              </span>
              <input
                type="text"
                name="quantityOfBoxes"
                placeholder="Quantity of Boxes"
                value={values.quantityOfBoxes}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full p-3 border rounded text-gray-400 text-sm font-medium focus:ring-1 focus:ring-gray-400 focus:outline-none"
              />
            </div>
            <div className="flex flex-col w-full h-[300px]">
              <div className="flex flex-col space-y-4 overflow-y-auto">
                {boxes.map((box : any, index) => (
                // {[...Array(Number(values.noOfBoxes))].map((_, index) => (
                  <div key={index} className="flex flex-col w-full">
                    {index > 0 && (
                      <div className="flex flex-row w-full justify-between text-base font-medium pb-4 text-[#0D8FFD]">
                        Box {index + 1}
                        <button
                          className="text-[#FF4949] font-medium"
                          onClick={() => handleDeleteBox(index)}
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                    <div className="flex flex-row w-full space-x-4 pb-4">
                      <div className="flex flex-col w-1/2">
                        <span className="text-sm font-bold pb-1">Length</span>
                        <div className="relative mb-6">
                          <input
                            type="text"
                            value={box.length}
                            name="length"
                            onChange={(e) => handleBoxLengthChange(e, index)}
                            onBlur={handleBlur}
                            className="w-full p-3 border rounded text-gray-400 text-sm font-medium focus:ring-1 focus:ring-gray-400 focus:outline-none"
                          />
                          <div className="absolute inset-y-0 end-2.5 flex items-center ps-3.5 pointer-events-none">cm</div>
                        </div>
                      </div>
                      <div className="flex flex-col w-1/2">
                        <span className="text-sm font-bold pb-1">Width</span>
                        <div className="relative mb-6">
                          <input
                            type="text"
                            value={box.width}
                            name="width"
                            onChange={(e) => handleBoxWidthChange(e, index)}
                            onBlur={handleBlur}
                            className="w-full p-3 border rounded text-gray-400 text-sm font-medium focus:ring-1 focus:ring-gray-400 focus:outline-none"
                          />
                          <div className="absolute inset-y-0 end-2.5 flex items-center ps-3.5 pointer-events-none">cm</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row w-full space-x-4 pb-4">
                      <div className="flex flex-col w-1/2">
                        <span className="text-sm font-bold pb-1">Height</span>
                        <div className="relative mb-6">
                          <input
                            type="text"
                            value={box.height}
                            name="height"
                            onChange={(e) => handleBoxHeightChange(e, index)}
                            onBlur={handleBlur}
                            className="w-full p-3 border rounded text-gray-400 text-sm font-medium focus:ring-1 focus:ring-gray-400 focus:outline-none"
                          />
                          <div className="absolute inset-y-0 end-2.5 flex items-center ps-3.5 pointer-events-none">cm</div>
                        </div>
                      </div>
                      <div className="flex flex-col w-1/2">
                        <span className="text-sm font-bold pb-1">Weight</span>
                        <div className="relative mb-6">
                          <input
                            type="number"
                            value={box.weight}
                            name="weight"
                            onChange={(e) => handleBoxWeightChange(e, index)}
                            onBlur={handleBlur}
                            className="w-full p-3 border rounded text-gray-400 text-sm font-medium focus:ring-1 focus:ring-gray-400 focus:outline-none"
                          />
                          <div className="absolute inset-y-0 end-2.5 flex items-center ps-3.5 pointer-events-none">cm</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="text-[#0D8FFD] font-medium mt-4"
                onClick={handleAddBox}
                type="button"
              >
                Add Another Box
              </button>
            </div>

            <div className="flex flex-row w-full gap-4 pb-4">
              <input
                type="checkbox"
                id="inStockCheckbox"
                checked={values.inStock}
                onChange={() => setFieldValue("inStock", !values.inStock)}
              />
              <label htmlFor="inStockCheckbox">In Stock</label>
            </div>
          </div>
        </div>
        {data?.customizations && (
          <div className="flex flex-col w-full">
            <div className="flex flex-row w-full gap-4 items-center">
              <div className="flex flex-col w-1/2">
                <span className="text-sm font-bold pb-1">Customization</span>
                <textarea
                  value={customizations?.customization || ''}
                  className="w-full p-3 border rounded text-gray-400 text-sm font-medium focus:ring-1 focus:ring-gray-400 focus:outline-none"
                  rows={1}
                  disabled
                />
              </div>

              <div className="flex flex-col w-1/2">
                <span className="text-sm font-bold pb-1">Price</span>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">&euro;</div>
                  <input
                    type="number"
                    value={customizations?.price || undefined}
                    onChange={handleCustomizationPriceChange}
                    placeholder="Quote Price"
                    className="block ps-10 w-full p-3 border rounded text-gray-400 text-sm font-medium focus:ring-1 focus:ring-gray-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-row w-full gap-4 items-center mt-5">
              <div className="flex w-1/2 items-center">
                <input
                  type="checkbox"
                  checked={customizations?.notPossible}
                  onChange={handleCustomizationNotPossibleChange}
                />
                <span className="ml-2 text-sm font-medium">Not Possible</span>
              </div>
              {customizations?.notPossible && (
                <div className="flex flex-col w-1/2">
                  <span className="text-sm font-medium pb-1">Reason</span>
                  <input
                    type="text"
                    name="reason"
                    value={customizations?.reason || ''}
                    onChange={(e) => handleCustomizationReasonChange(e.target.value)}
                    onBlur={handleBlur}
                    className="w-full p-3 border rounded text-gray-400 text-sm font-medium focus:ring-1 focus:ring-gray-400 focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>
        )}
        <br />
        <div className="flex flex-col w-full">
          {variants.map((variant : any, index) => (
            <>
              <div className="flex flex-row w-full gap-4 items-center">
                <div className="flex flex-col w-1/3">
                  <span className="text-sm font-bold pb-1">Variant</span>
                  {variant.type.name}
                </div>
                <div className="flex flex-col w-1/3">
                  <span className="text-sm font-bold pb-1">Description</span>
                  {variant.description}
                </div>
                <div className="flex flex-col w-1/3">
                  <span className="text-sm font-bold pb-1">Price</span>
                  <div className="relative mb-6">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">&euro;</div>
                    <input
                      type="number"
                      value={variant?.price || undefined}
                      onChange={(e) => handleVariantPriceChange(e, index)}
                      placeholder="Quote Price"
                      className="block ps-10 w-full p-3 border rounded text-gray-400 text-sm font-medium focus:ring-1 focus:ring-gray-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-row w-full gap-4 items-center">
                <div className="flex w-1/2 items-center">
                  <input
                    type="checkbox"
                    checked={variant.notPossible}
                    onChange={() => handleVariantNotPossibleChange(index)}
                  />
                  <span className="ml-2 text-sm font-medium">Not Possible</span>
                </div>
                {variant.notPossible && (
                <div className="flex flex-col w-1/2">
                  <span className="text-sm font-medium pb-1">Reason</span>
                  <input
                    type="text"
                    name={`reason-${variant.id}`}
                    value={variant.reason}
                    onChange={(e) => handleNotPossibleReasonChange(index, e.target.value)}
                    onBlur={handleBlur}
                    className="w-full p-3 border rounded text-gray-400 text-sm font-medium focus:ring-1 focus:ring-gray-400 focus:outline-none"
                  />
                </div>
                )}
              </div>
            </>
          ))}
        </div>
        <div className="edit-buttons flex w-full justify-end gap-4 p-5">
          <RedButtonOutlined
            onClick={handleBack}
            text="Back"
            buttonType="button"
          />
          <PrimaryButton
            buttonType="submit"
            text="Submit"
          />
        </div>
      </div>
    </>
  );
};

export default QuoteFormStepTwo;

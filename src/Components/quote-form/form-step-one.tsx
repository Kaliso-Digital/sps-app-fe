import React, { useState, ChangeEvent } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button from "@mui/material/Button";
import Popup from "../../Interface/Popup";
import { pink } from "@mui/material/colors";
import { styled } from "@mui/system";
import QuoteFormStepTwo from "./form-step-two";
import { Formik, useFormikContext } from "formik";
import { QuoteFormValues } from ".";
import { UploadInput } from "../upload-input";
import RedButtonOutlined from "../RedButtonOutlined";
import PrimaryButton from "../PrimaryButton";

export const QuoteFormStepOne: React.FC<Popup> = ({ onClose, handleNext }) => {
  const { handleBlur, handleChange, setFieldValue, values } =
    useFormikContext<QuoteFormValues>();

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    setFieldValue("image", selectedFile || null);
  };

  const handleVideoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    setFieldValue("video", selectedFile || null);
  };

  const renderVideoPreview = () => {
    if (values.video) {
      // Render video preview
      return (
        <video
          src={URL.createObjectURL(values.video)}
          controls
          className="uploaded-video w-full h-32"
        />
      );
    } else {
      // Render placeholder
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
                stroke-linecap="round"
                d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </div>
          <div className="upload-text text-center">
            Upload
            <br />
            Video
          </div>
        </>
      );
    }
  };

  const renderImagePreview = () => {
    if (values.image) {
      return (
        <img
          src={URL.createObjectURL(values.image)}
          alt="Selected"
          className="uploaded-image"
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

  return (
    <>
      <div className="flex flex-row w-full min-h-min">
        <div className="flex flex-col justify-between w-1/2 p-5">
          <div className="flex flex-col w-full pb-4">
            <span className="text-sm font-bold pb-1">Product Name <small>*</small></span>
            <input
              type="text"
              value={values.productName}
              name="productName"
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full  p-3 border rounded text-gray-400 text-sm font-medium  focus:ring-1 focus:ring-gray-400 focus:outline-none"
              required
            />
          </div>
          <div className="flex flex-col w-full pb-4">
            <span className="text-sm font-bold pb-1">
              Detailed Description <small>*</small>
            </span>
            <textarea
              value={values.productDesc}
              name="productDesc"
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full  p-3 border rounded text-gray-400 text-sm font-medium  focus:ring-1 focus:ring-gray-400 focus:outline-none"
              rows={3}
              required
            />
          </div>
          <div className="flex flex-col w-full pb-4">
            <span className="text-sm font-bold pb-1">Found Price <small>*</small></span>
            <div className="relative mb-4">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">USD</div>
              <input
                type="text"
                value={values.foundPrice}
                name="foundPrice"
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full ps-10 p-3 border rounded text-gray-400 text-sm font-medium  focus:ring-1 focus:ring-gray-400 focus:outline-none"
                required
              />
            </div>
            <small className="text-sm text-gray">Target Price: USD {}</small>
          </div>
          <div className="flex flex-row w-full space-x-4 pb-4">
            <div className="flex flex-col w-1/2">
              <span className="text-sm font-bold pb-1">Length of Product <small>*</small></span>
              <div className="relative mb-6">
                <input
                  type="text"
                  value={values.length}
                  name="length"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full  p-3 border rounded text-gray-400 text-sm font-medium  focus:ring-1 focus:ring-gray-400 focus:outline-none"
                  required
                />
                <div className="absolute inset-y-0 end-2.5 flex items-center ps-3.5 pointer-events-none">cm</div>
              </div>
            </div>
            <div className="flex flex-col w-1/2">
              <span className="text-sm font-bold pb-1">Width of Product <small>*</small></span>
              <div className="relative mb-6">
                <input
                  type="text"
                  value={values.width}
                  name="width"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full  p-3 border rounded text-gray-400 text-sm font-medium  focus:ring-1 focus:ring-gray-400 focus:outline-none"
                  required
                />
                <div className="absolute inset-y-0 end-2.5 flex items-center ps-3.5 pointer-events-none">cm</div>
              </div>
            </div>
          </div>
          <div className="flex flex-row w-full space-x-4 pb-4">
            <div className="flex flex-col w-1/2">
              <span className="text-sm font-bold pb-1">Height of Product <small>*</small></span>
              <div className="relative mb-6">
                <input
                  type="text"
                  value={values.height}
                  name="height"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full  p-3 border rounded text-gray-400 text-sm font-medium  focus:ring-1 focus:ring-gray-400 focus:outline-none"
                  required
                />
                <div className="absolute inset-y-0 end-2.5 flex items-center ps-3.5 pointer-events-none">cm</div>
              </div>
            </div>
            <div className="flex flex-col w-1/2">
              <span className="text-sm font-bold pb-1">Weight of Product <small>*</small></span>
              <div className="relative mb-6">
                <input
                  type="text"
                  value={values.weight}
                  name="weight"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full  p-3 border rounded text-gray-400 text-sm font-medium  focus:ring-1 focus:ring-gray-400 focus:outline-none"
                  required
                />
                <div className="absolute inset-y-0 end-2.5 flex items-center ps-3.5 pointer-events-none">kg</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between w-1/2 p-5">
          <div className="flex flex-col  pb-4">
            <UploadInput
              label="Product Image"
              render={renderImagePreview}
              id="imageUpload"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
          <div className="flex flex-col w-full pb-4">
            <UploadInput
              label="Product Video"
              render={renderVideoPreview}
              id="videoUpload"
              accept="video/*"
              onChange={handleVideoUpload}
            />
          </div>
          <div className="flex flex-col w-full pb-4">
            <span className="text-sm font-bold pb-1">Response to Notes <small>*</small></span>
            <textarea
              name="notes"
              value={values.notes}
              placeholder="Detailed Description"
              className="w-full  p-3 border rounded text-gray-400 text-sm font-medium  focus:ring-1 focus:ring-gray-400 focus:outline-none "
              rows={3}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>
      <div className="edit-buttons flex w-full justify-end gap-4 p-5">
        <RedButtonOutlined
        onClick={onClose}
        text="Cancel"
        buttonType="button"
        />
        <PrimaryButton
          onClick={handleNext}
          text="Next"
          buttonType="button"
        />
      </div>
    </>
  );
};

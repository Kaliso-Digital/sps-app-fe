import React, { useState } from "react";
import Popup from "../../Interface/Popup";
import { Form, Formik } from "formik";
import { QuoteFormStepOne } from "./form-step-one";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import QuoteFormStepTwo from "./form-step-two";
import { useFetch } from "../../hooks/use-fetch";
import { makeRequest } from "../../Service/api";
import { QUOTEURL } from "../../Constants/api";
import { toast } from "react-toastify";

export const initialQuoteFormValues = {
  productName: "",
  productDesc: "",
  notes: "",
  foundPrice: "",
  length: "",
  width: "",
  height: "",
  weight: "",
  image: null,
  step: 1,
  certification: null,
  isBattery: false,
  isLiquid: false,
  isFoodPlant: false,
  isPlantProduct: false,
  orderArrival: "",
  quantityOfBoxes: "",
  inStock: false,
  noOfBoxes: 1,
  variants: null,
  customizations: null,
  video: null,
  boxes: null,
};

export type QuoteFormValues = {
  image: File | null;
  video: File | null;
  certification: File | null;
} & typeof initialQuoteFormValues;

const objectToFormData = (obj: any) => {
  const formData = new FormData();

  Object.keys(obj).forEach((key) => {
    if (obj[key] instanceof File) {
      formData.append(key, obj[key]);
    } else if (obj[key] instanceof Blob) {
      formData.append(key, obj[key]);
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      formData.append(key, JSON.stringify(obj[key]));
    } else {
      formData.append(key, obj[key]);
    }
  });

  return formData;
};

const AddQuoteForm: React.FC<Popup> = (props) => {
  const [step, setStep] = useState(1);

  const { sendRequest, data, loading } = useFetch();

  const handleGoBack = () => {
    window.history.back(); // Navigate back using browser's history
  };

  const handleSubmit = async (values: QuoteFormValues) => {
    console.log(values);
    const formData = objectToFormData(values);

    try {
      const responseData = await makeRequest(
        'post',
        `${QUOTEURL}/${props.data?.id}/`,
        formData,
        {"ngrok-skip-browser-warning": "69420"}
      );
      
      props.onClose();
    } catch (error) {
      toast.error(`Something went wrong! ${error}`);
    }
  };

  return (
    <Formik
      initialValues={initialQuoteFormValues}
      onSubmit={(values) => {
        handleSubmit(values);
      }}
    >
      <Form>
        <div className="fixed inset-0 overflow-y-auto bg-black bg-opacity-50 flex justify-center items-center h-screen">
          <div className="bg-white p-8 rounded-md w-[750px]">
            <div className="rounded-[10px] flex flex-col h-full pb-5 mx-1">
              <div className="w-full justify-between flex flex-row items-center p-3 pb-6">
                <div className="inquiry-table-header flex flex-row items-center gap-4 ">
                  {step === 1 && (
                    <ArrowBackIcon
                      className="text-[#0D8FFD] cursor-pointer"
                      onClick={handleGoBack}
                    />
                  )}
                  {step === 2 && (
                    <ArrowBackIcon
                      className="text-[#0D8FFD] cursor-pointer"
                      onClick={() => setStep(1)}
                    />
                  )}

                  <div className="heading font-bold text-2xl sticky">
                    Product Details
                  </div>
                </div>
                {step && (
                  <div className="text-base font-bold">{step}/2 Steps</div>
                )}
              </div>

              <div className="inquiry-form w-full flex flex-col h-full overflow-y-auto">
                {step === 1 && (
                  <QuoteFormStepOne
                    onClose={props.onClose}
                    handleNext={() => setStep(2)}
                    data={props.data}
                  />
                )}
                {step === 2 && (
                  <QuoteFormStepTwo
                    onClose={props.onClose}
                    handleBack={() => setStep(1)}
                    data={props.data}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </Form>
    </Formik>
  );
};

export default AddQuoteForm;

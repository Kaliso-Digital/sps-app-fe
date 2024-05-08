import React, { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button from "@mui/material/Button";
import { usePermissions } from "../Service/PermissionsContext";
import { makeRequest } from "../Service/api";
import { INVOICEURL } from "../Constants/api";
import Invoice from "../Interface/Invoice";
import Popup from "../Interface/Popup";
import RedButtonOutlined from "./RedButtonOutlined";
import PrimaryButton from "./PrimaryButton";
import { toast } from "react-toastify";
import { PAYMENT_BANK_TRANSFER, PAYMENT_PAYPAL } from "../Constants/payment";

const MockInvoicePayment = {
  name: "Product name",
  total: 1000,
  billingDetails: {
    name: "John Doe",
    address: "123 Main St, New York, NY 10030",
    phone: "(555) 555-5555",
  },
  paymentMethod: "Visa",
};

export const InvoicePayment: React.FC<Popup> = ({ onClose, data }) => {
  const [id, setId] = useState(data);
  const { userPermissions }= usePermissions();
  const paymentMethods = [{"id": PAYMENT_PAYPAL, "name": "PayPal"}, {"id": PAYMENT_BANK_TRANSFER, "name": "Bank Transfer"}];
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    paymentMethods[0].id // Set the default payment method
  );
  const [invoice, setInvoice] = useState<Invoice | null>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInvoice();
  }, []);

  const fetchInvoice = async () => {
    setLoading(true);

    const responseData = await makeRequest('get',
                                           `${INVOICEURL}/${id}`);
    if (responseData.data) {
      setInvoice(responseData.data);
    }
    setLoading(false);
  }

  const handleGoBack = () => {
    window.history.back();
  };
  const handleCancel = () => {
    window.history.back();
  };

  const handlePayment = async () => {
    try {
      // Update Selected Channel
      const responseData = await makeRequest('put',
                                `${INVOICEURL}/${id}/payment/${selectedPaymentMethod}`);
      
      if (selectedPaymentMethod !== PAYMENT_BANK_TRANSFER) {
        // Update Payment Status
        const responseData2 = await makeRequest('put',
                                    `${INVOICEURL}/${id}/payment-complete`);
        
        if (responseData2.result) {
          onClose();
        }
      } 
    } catch (error) {
      toast.error(`Something went wrong! ${error}`);
    }
  };

  return (
    <div className="fixed inset-0 overflow-y-auto bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-md w-[750px]">
        <div className="inquiry-table-header flex flex-row justify-Center items-center w-full p-3 pb-6 gap-4 ">
          <button
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
            onClick={onClose}
            type="button"
          >
            <svg
              className="w-6 h-6"
              fill="red"
              stroke="red"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <div className="heading font-bold text-2xl">Inquiry Invoice Payment</div>
        </div>
        {loading ? (
          <div className="rounded-[10px] h-full flex items-center justify-center">
            <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            >
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
          </div>
        ) : (
          <div
            className=" rounded-[10px] w-full flex flex-col h-full pb-5 mx-1"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#888 #f1f1f1",
              animation: "scrollbarAnimation 0.5s ease-in-out"
            }}
          >
            <div className=" pb-4 ">
              <div className="text-xl font-medium pb-8 ">
                {invoice?.quote?.name}
              </div>
              <hr className=" h-1" />
            </div>
            <div className="total flex flex-row justify-between items-center pb-6">
              <div className="text-xl font-bold">Total</div>
              <div className="text-xl font-bold text-gray-700">{`$${invoice?.quote?.price}`}</div>
            </div>
            <div className="flex flex-col w-full pb-6">
              <div className="text-lg font-semibold pb-4">Billing Details</div>
              <div className="flex flex-row w-1/3">
                <div className="text-sm w-1/2">Name</div>
                <div className="text-sm text-gray-500 w-1/2">
                  {invoice?.customer?.name}
                </div>
              </div>
              <div className="flex flex-row w-1/3">
                <div className="text-sm w-1/2">Address</div>
                <div className="text-sm text-gray-500 w-1/2">
                  {invoice?.customer?.address?.address}
                </div>
              </div>
              <div className="flex flex-row w-1/3">
                <div className="text-sm w-1/2">Phone Number</div>
                <div className="text-sm text-gray-500 w-1/2">
                  {invoice?.customer?.phone}
                </div>
              </div>
            </div>
            <div>
              <div className="text-lg font-semibold pb-4">Payment Method</div>
              {paymentMethods.map((method) => {
                return (
                  <label key={method.id} className="flex items-center">
                    <input
                      type="radio"
                      value={method.id}
                      checked={selectedPaymentMethod === method.id}
                      onChange={() => setSelectedPaymentMethod(method.id)}
                      className="mr-4"
                    />
                    {method.name}
                  </label>
                );
              })}
              {selectedPaymentMethod === 2 && (
                <span><small>
                  Titolare: SPS FULFILLMENT SOCIETA' A RESPONSABILITA' LIMITATA SEMPLIFICATA<br />
                  IBAN: IT38 V360 9201 6009 4682 7303 152<br />
                  Codice BIC/SWIFT: QNTOITM2XXX<br />
                  Indirizzo del titolare: Via Borgonuovo 9, 20121 Milano (MI), IT<br />
                  </small></span>
              )}
            </div>
              <div className="quote-actions flex justify-end gap-8 mt-6">
              <RedButtonOutlined
                onClick={handleCancel}
                text="Cancel"
                buttonType="button"
              />
              <PrimaryButton
                onClick={handlePayment}
                text="Proceed Payment"
                buttonType="button"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoicePayment;

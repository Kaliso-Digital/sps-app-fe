import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/system";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useParams } from "react-router-dom";
import Popup from "../../Interface/Popup";
import { makeRequest } from "../../Service/api";
import { INVOICEURL, QUOTEURL } from "../../Constants/api";
import RedButtonOutlined from "../../Components/RedButtonOutlined";
import PrimaryButton from "../../Components/PrimaryButton";
import Invoice from "../../Interface/Invoice";
import { toast } from "react-toastify";
import { QUOTE_STATUS_ACCEPTED, QUOTE_STATUS_REJECTED } from "../../Constants/quote";
import { usePermissions } from "../../Service/PermissionsContext";
import { PERM_INVOICE_ACCEPT, PERM_INVOICE_CREATE, PERM_INVOICE_REJECT } from "../../Constants/permission";
import { INVOICE_STATUS_ACCEPTED, INVOICE_STATUS_REJECTED } from "../../Constants/invoice";

const isVideo = (url: string | null) => {
  if (url) {
    const videoExtensions = [".mp4", ".webm", ".ogg"];
    return videoExtensions.some((extension) => url.endsWith(extension));
  } else {
    return false;
  }
};

const ViewInvoicePopup: React.FC<Popup> = ({ onClose, data }) => {
  const [id, setId] = useState(data);
  const { userPermissions } = usePermissions();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(userPermissions);
    fetchInvoice();
  }, [userPermissions]);

  const fetchInvoice = async () => {
    setLoading(true);

    const responseData = await makeRequest('get',
      `${INVOICEURL}/${id}`)
    if (responseData.data) {
      setInvoice(responseData.data);
    }

    setLoading(false);
  }
  const handleAcceptInvoice = async () => {
    try {
      const responseData = await makeRequest('put',
        `${INVOICEURL}/${id}/accept`);
      if (responseData.result) {
        onClose();
      }
    } catch (error) {
      toast.error(`Something went wrong! ${error}`);
    }
  };

  const handleRejectInvoice = async () => {
    try {
      const responseData = await makeRequest('put',
        `${INVOICEURL}/${id}/reject`);

      if (responseData.result) {
        onClose();
      }
    } catch (error) {
      toast.error(`Something went wrong! ${error}`);
    }
  };

  const truncateFileName = (fileName: string, maxLength = 20) => {
    return fileName.length > maxLength
      ? fileName.substring(0, maxLength - 3) + "..."
      : fileName;
  };

  const handleViewFile = (fileUrl: string | null) => {
    if (fileUrl) {
      // Open the file in a new tab or window
      window.open(fileUrl, "_blank");
    } else {
      // Handle the case where there is no file URL (e.g., show an error message)
      console.error("No file URL provided");
      // You can also display a notification or take other appropriate action
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
          <div className="heading font-bold text-2xl">Inquiry Invoice</div>
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
            className="inquiry-form w-full flex flex-col h-full overflow-y-auto px-5 pt-5"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#888 #f1f1f1",
              animation: "scrollbarAnimation 0.5s ease-in-out",
            }}
          >
            <div className="invoice-details">
              <div className="w-full">
                <div className="text-lg font-extrabold pb-4">
                  Invoice Specifications
                </div>

                <div className="flex flex-row w-full h-full gap-4">
                  <div className="specification-column w-full">
                    <div className="specification-values mb-4">
                      <div className="flex flex-row justify-between items-center">
                        <div
                          className="text-sm text-gray-600 font-normal cursor-pointer hover:underline"
                          onClick={() =>
                            handleViewFile(
                              invoice?.file || null
                            )
                          }
                        >
                          {truncateFileName(
                            invoice?.file || "Invoice File"
                          )}
                        </div>
                        <button
                          className="mb-2 text-[#0D8FFD]"
                          onClick={() =>
                            handleViewFile(
                              invoice?.file || null
                            )
                          }
                        >
                          View File
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <br />
              

              <div className="quote-actions flex justify-end gap-8 mt-6">
                {userPermissions
                .filter(permission => permission.name === PERM_INVOICE_ACCEPT)
                .map(filteredItem => (
                  <RedButtonOutlined
                    onClick={handleRejectInvoice}
                    text="Reject Invoice"
                    buttonType="button"
                    disabled={invoice?.status.id === INVOICE_STATUS_REJECTED}
                  /> 
                ))}

                {userPermissions
                .filter(permission => permission.name === PERM_INVOICE_REJECT)
                .map(filteredItem => (
                  <PrimaryButton
                    onClick={handleAcceptInvoice}
                    text="Accept Invoice"
                    buttonType="button"
                    disabled={invoice?.status.id === INVOICE_STATUS_ACCEPTED}
                  /> 
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewInvoicePopup;

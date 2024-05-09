import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/system";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useParams } from "react-router-dom";
import Popup from "../../Interface/Popup";
import { makeRequest } from "../../Service/api";
import { QUOTEURL } from "../../Constants/api";
import RedButtonOutlined from "../../Components/RedButtonOutlined";
import PrimaryButton from "../../Components/PrimaryButton";
import Quote from "../../Interface/Quote";
import { toast } from "react-toastify";
import { QUOTE_STATUS_ACCEPTED, QUOTE_STATUS_REJECTED } from "../../Constants/quote";
import { usePermissions } from "../../Service/PermissionsContext";
import { PERM_INVOICE_CREATE } from "../../Constants/permission";

const isVideo = (url: string | null) => {
  if (url) {
    const videoExtensions = [".mp4", ".webm", ".ogg"];
    return videoExtensions.some((extension) => url.endsWith(extension));
  } else {
    return false;
  }
};

const ViewQuotePopup: React.FC<Popup> = ({ onClose, data }) => {
  const [id, setId] = useState(data);
  const { userPermissions } = usePermissions();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQuote();
  }, []);

  const fetchQuote = async () => {
    setLoading(true);

    const responseData = await makeRequest('get',
                                           `${QUOTEURL}/${id}`)
    if (responseData.data) {
      setQuote(responseData.data);
    }

    setLoading(false);
  }
  const handleAcceptQuote = async () => {
    console.log("Accept Quote");
    try {
      const responseData = await makeRequest('put',
                                            `${QUOTEURL}/${id}/accept`);
      if (responseData.result) {
        onClose();
      }
    } catch (error) {
      toast.error(`Something went wrong! ${error}`);
    }
  };

  const handleRejectQuote = async () => {
    console.log("Reject Quote");
    try {
      const responseData = await makeRequest('put',
                                              `${QUOTEURL}/${id}/reject`);
      
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
            <div className="flex flex-row">
              <div className="w-1/2 pr-2">
                <div className="media-view-box h-32 bg-gray-200 mb-4 rounded">
                  {isVideo(quote?.image || null) ? (
                    <video
                      width="100%"
                      height="100%"
                      style={{ maxWidth: "100%", maxHeight: "100%" }}
                      controls
                    >
                      <source src={quote?.image} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={quote?.image}
                      alt="Media 1"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="w-1/2 pl-2">
                <div className="media-view-box h-32 bg-gray-200 mb-4 rounded">
                  {isVideo(quote?.video || null) ? (
                    <video
                      width="100%"
                      height="100%"
                      style={{ maxWidth: "100%", maxHeight: "100%" }}
                      controls
                    >
                      <source src={quote?.video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={quote?.video}
                      alt="Media 2"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="invoice-details">
              <div className="inquiry-name text-xl font-medium pb-4">
                {quote?.productName}
              </div>
              <div className="inquiry-description font-normal text-sm mb-4">
                {quote?.productDesc}
              </div>

              <div className="w-full">
                <div className="text-lg font-extrabold pb-4">
                  Inquiry Specifications
                </div>

                <div className="flex flex-row w-full h-full gap-4">
                  <div className="specification-column flex flex-col w-1/3 justify-between">
                    <div className="flex flex-col h-full">
                      <div className="specification-heading text-sm font-bold">
                        Length
                      </div>
                      <div className="specification-values text-xs text-gray-600 font-medium">
                        {quote?.length}
                      </div>
                    </div>
                    <div className="flex flex-col h-full">
                      <div className="specification-heading text-sm font-bold">
                        Width
                      </div>
                      <div className="specification-values text-xs text-gray-600 font-medium">
                        {quote?.width}
                      </div>
                    </div>
                    <div className="flex flex-col h-full">
                      <div className="specification-heading text-sm font-bold">
                        Height
                      </div>
                      <div className="specification-values text-xs text-gray-600 font-medium">
                        {quote?.height}
                      </div>
                    </div>
                  </div>

                  <div className="specification-column flex flex-col w-1/3 justify-between">
                    <div className="flex flex-col h-full">
                      <div className="specification-heading text-sm font-bold">
                        Quantity of Boxes
                      </div>
                      <div className="specification-values text-xs text-gray-600 font-medium">
                        {quote?.noOfBoxes}
                      </div>
                    </div>
                    <div className="flex flex-col h-full">
                      <div className="specification-heading text-sm font-bold">
                        Box Size for Each
                      </div>
                      <div className="specification-values text-xs text-gray-600 font-medium">
                        {quote?.width} * {quote?.length} * {quote?.height}
                      </div>
                    </div>
                    <div className="flex flex-col h-full">
                      <div className="specification-heading text-sm font-bold">
                        Weight
                      </div>
                      <div className="specification-values text-xs text-gray-600 font-medium">
                        {quote?.weight}
                      </div>
                    </div>
                  </div>

                  <div className="specification-column w-1/3">
                    <div className="specification-values mb-4">
                      <div className="specification-heading text-md font-bold mb-2">
                        Certification
                      </div>
                      <div className="flex flex-row justify-between items-center">
                        <div
                          className="text-sm text-gray-600 font-normal cursor-pointer hover:underline"
                          onClick={() =>
                            handleViewFile(
                              quote?.certification || null
                            )
                          }
                        >
                          {truncateFileName(
                            quote?.certification || "Certification"
                          )}
                        </div>
                        <button
                          className="mb-2 text-[#0D8FFD]"
                          onClick={() =>
                            handleViewFile(
                              quote?.certification || null
                            )
                          }
                        >
                          View File
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-row items-center justify-start gap-4 mb-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={!!quote?.isBattery || false}
                      />
                      <div className="text-sm font-medium">Battery</div>
                    </div>
                    <div className="flex flex-row items-center justify-start gap-4 mb-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={!!quote?.isLiquid || false}
                      />
                      <div className="text-sm font-medium">Liquid</div>
                    </div>
                    <div className="flex flex-row items-center justify-start gap-4 mb-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={!!quote?.isFoodPlant || false}
                      />
                      <div className="text-sm font-medium">Food/Plant</div>
                    </div>
                  </div>
                </div>
              </div>
              <br />
              <hr />
              <br />
              <div className="found-price-section flex justify-between items-center mt-4">
                <div className="found-price-heading font-extrabold text-2xl">
                  Found Price
                </div>
                <div className="found-price-value text-2xl font-extrabold">
                  USD {`${quote?.foundPrice}`}
                </div>
              </div>

              <div className="quote-actions flex justify-end gap-8 mt-6">
                <RedButtonOutlined
                  onClick={onClose}
                  text="Cancel"
                  buttonType="button"
                />
                {(userPermissions.some((permission) => permission.name === PERM_INVOICE_CREATE && 
                  <>
                    <RedButtonOutlined
                      onClick={handleRejectQuote}
                      text="Reject Quote"
                      buttonType="button"
                      disabled={quote?.status.id === QUOTE_STATUS_REJECTED}
                    />
                    <PrimaryButton
                      onClick={handleAcceptQuote}
                      text="Accept Quote"
                      buttonType="button"
                      disabled={quote?.status.id === QUOTE_STATUS_ACCEPTED}
                    />
                  </>
                ))}
                {/* <Link to={`/inquirystatus/:id/invoice/payment`}>
                  <Button
                    variant="contained"
                    style={{ backgroundColor: "#0D8FFD" }}
                    className="items-center gap-2 flex flex-row justify-center text-center"
                    onClick={handleAcceptQuote}
                  >
                    Accept Quote
                  </Button>
                </Link> */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewQuotePopup;

import React from "react";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/system";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom";

const mockInvoice = {
  id: "123",
  name: "Mock Invoice",
  description: "This is a mock invoice description.",
  media1:
    "https://images.unsplash.com/photo-1556910636-c508da52e01c?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  media2:
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  specifications: {
    length: 10,
    width: 5,
    height: 8,
    quantity: 100,
    boxSize: "Small",
    weight: 500,
    certification:
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    battery: true,
    liquid: false,
  },
  foundPrice: 1000,
};

const isVideo = (url: string) => {
  const videoExtensions = [".mp4", ".webm", ".ogg"];
  return videoExtensions.some((extension) => url.endsWith(extension));
};

const Invoice = () => {
  const handleGoBack = () => {
    window.history.back();
  };
  const handleAcceptQuote = () => {};

  const handleRejectQuote = () => {
    console.log("Reject Quote");
  };

  const truncateFileName = (fileName: string, maxLength = 20) => {
    return fileName.length > maxLength
      ? fileName.substring(0, maxLength - 3) + "..."
      : fileName;
  };

  const handleViewFile = (fileUrl: string) => {
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
    <div className="w-full pt-8 h-[90vh] py-8  ">
      <div
        className=" rounded-[10px]  flex flex-col h-full  pb-5 mx-1"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#888 #f1f1f1",
          animation: "scrollbarAnimation 0.5s ease-in-out",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div className="inquiry-table-header flex flex-row justify-Center items-center w-full p-3 pb-6 gap-4 ">
          <ArrowBackIcon className="text-[#0D8FFD]" onClick={handleGoBack} />
          <div className="heading font-bold text-2xl">Inquiry Invoice</div>
        </div>
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
              <div className="media-view-box h-32 bg-gray-200 mb-4">
                {isVideo(mockInvoice.media1) ? (
                  <video
                    width="100%"
                    height="100%"
                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                    controls
                  >
                    <source src={mockInvoice.media1} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={mockInvoice.media1}
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
              <div className="media-view-box h-32 bg-gray-200 mb-4">
                {isVideo(mockInvoice.media2) ? (
                  <video
                    width="100%"
                    height="100%"
                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                    controls
                  >
                    <source src={mockInvoice.media2} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={mockInvoice.media2}
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
            <div className="inquiry-name text-xl font-bold pb-4">
              {mockInvoice?.name || "Invoice Name"}
            </div>
            <div className="inquiry-description mb-4">
              {" "}
              {mockInvoice.description || "Invoice description"}
            </div>

            <div className="w-full">
              <div className="text-lg font-bold pb-4">
                Inquiry Specifications
              </div>
              <div className="flex flex-row w-full h-full gap-4">
                <div className="specification-column flex flex-col w-1/3 justify-between">
                  <div className="flex flex-col h-full">
                    <div className="specification-heading text-base font-medium">
                      Length
                    </div>
                    <div className="specification-values text-sm text-gray-600 font-normal">
                      {mockInvoice.specifications?.length || "Length"}
                    </div>
                  </div>
                  <div className="flex flex-col h-full">
                    <div className="specification-heading text-base font-medium">
                      Width
                    </div>
                    <div className="specification-values text-sm text-gray-600 font-normal">
                      {mockInvoice.specifications?.width || "Width"}
                    </div>
                  </div>
                  <div className="flex flex-col h-full">
                    <div className="specification-heading text-base font-medium">
                      Height
                    </div>
                    <div className="specification-values text-sm text-gray-600 font-normal">
                      {mockInvoice.specifications?.height || "Height"}
                    </div>
                  </div>
                </div>

                <div className="specification-column flex flex-col w-1/3 justify-between">
                  <div className="flex flex-col h-full">
                    <div className="specification-heading text-base font-medium">
                      Quantity of Boxes
                    </div>
                    <div className="specification-values text-sm text-gray-600 font-normal">
                      {mockInvoice.specifications?.quantity || "Quantity"}
                    </div>
                  </div>
                  <div className="flex flex-col h-full">
                    <div className="specification-heading text-base font-medium">
                      Box Size for Each
                    </div>
                    <div className="specification-values text-sm text-gray-600 font-normal">
                      {mockInvoice.specifications?.boxSize || "Box Size"}
                    </div>
                  </div>
                  <div className="flex flex-col h-full">
                    <div className="specification-heading text-base font-medium">
                      Weight
                    </div>
                    <div className="specification-values text-sm text-gray-600 font-normal">
                      {mockInvoice.specifications?.weight || "Weight"}
                    </div>
                  </div>
                </div>

                <div className="specification-column w-1/3">
                  <div className="specification-values mb-4">
                    <div className="specification-heading  text-base font-medium mb-2">
                      Certification
                    </div>
                    <div className="flex flex-row justify-between items-center">
                      <div
                        className="text-sm text-gray-600 font-normal cursor-pointer hover:underline"
                        onClick={() =>
                          handleViewFile(
                            mockInvoice.specifications?.certification
                          )
                        }
                      >
                        {truncateFileName(
                          mockInvoice.specifications?.certification ||
                            "Certification"
                        )}
                      </div>
                      <button
                        className="mb-2 text-[#0D8FFD]"
                        onClick={() =>
                          handleViewFile(
                            mockInvoice.specifications?.certification
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
                      checked={mockInvoice.specifications?.battery || false}
                    />
                    <div className="text-base font-medium ">Battery</div>
                  </div>
                  <div className="flex flex-row items-center justify-start gap-4 mb-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={mockInvoice.specifications?.battery || false}
                    />
                    <div className="text-base font-medium ">Liquid</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="found-price-section flex justify-between items-center mt-4">
              <div className="found-price-heading font-bold text-2xl">
                Found Price <br /> (In dollors)
              </div>
              <div className="found-price-value text-lg font-bold">
                {`USD ${mockInvoice.foundPrice || "Found Price"}`}
              </div>
            </div>

            <div className="quote-actions flex justify-end gap-8 mt-6">
              <Button
                variant="outlined"
                onClick={handleRejectQuote}
                style={{
                  borderColor: "#FF4949",
                  borderWidth: 2,
                  fontWeight: "500",
                  color: "#FF4949",
                  paddingLeft: 16,
                  paddingRight: 16,
                }}
              >
                Reject Quote
              </Button>
              <Link to={`/inquirystatus/:id/invoice/payment`}>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#0D8FFD" }}
                  className="items-center gap-2 flex flex-row justify-center text-center"
                  onClick={handleAcceptQuote}
                >
                  Accept Quote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;

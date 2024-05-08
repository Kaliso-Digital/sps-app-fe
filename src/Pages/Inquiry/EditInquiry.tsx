// ViewAndEditInquiry.tsx
import React, { useState, useEffect, ChangeEvent } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard, faEye } from "@fortawesome/free-solid-svg-icons";
import Switch, { SwitchProps } from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Inquiry from "../../Interface/Inquiry";
import { useReferenceData } from "../../Service/ReferenceDataContext";
import { usePermissions } from "../../Service/PermissionsContext";
import {
  PERM_INQUIRY_CANCEL,
  PERM_INQUIRY_CLOSE,
  PERM_INQUIRY_CREATE,
  PERM_INQUIRY_EDIT,
  PERM_INQUIRY_GRN_UPDATE,
  PERM_INQUIRY_SHIPPING_UPDATE,
  PERM_INQUIRY_SUPPLIER_ASSIGN,
  PERM_INQUIRY_VIEW,
  PERM_INVOICE_CREATE,
  PERM_INVOICE_VIEW,
  PERM_QUOTE_CREATE,
  PERM_QUOTE_VIEW,
} from "../../Constants/permission";
import { makeRequest } from "../../Service/api";
import { INQUIRYURL } from "../../Constants/api";
import PrimaryButton from "../../Components/PrimaryButton";
import RedButtonOutlined from "../../Components/RedButtonOutlined";
import { VariantType } from "../../Interface/VariantType";
import AddSupplierPopup from "./AddSupplierPopup";
import ActionInquiry from "./ActionInquiry";
import AddQuotePopup from "../../Components/quote-form";
import { EDITABLE_STAGES, STAGE_ACCEPTED, STAGE_CANCELLED, STAGE_CLOSED, STAGE_INVOICED, STAGE_NO_INVOICE, STAGE_NO_QUOTE, STAGE_NO_SUPPLIER, STAGE_UPDATE_GRN, STAGE_UPDATE_SHIPPING } from "../../Constants/inquiry";
import { useUserStore } from "../../Service/userStore";
import ViewQuotePopup from "../Quote/ViewQuotePopup";
import QuantityInquiry from "./QuantityInquiry";
import AddInvoicePopup from "../Invoice/AddInvoice";
import ViewInvoicePopup from "../Invoice/ViewInvoice";
import InvoicePayment from "../../Components/InvoicePayment";

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-[#FFC933] text-white";
    case "accepted":
      return "bg-green-500 text-white";
    case "rejected":
      return "bg-[#FF4949] text-white";
    case "completed":
      return "bg-green-500 text-white";
    case "failed":
      return "bg-[#FF4949] text-white";
    default:
      return "bg-gray-200";
  }
};

const EditInquiry: React.FC = () => {
  const navigate = useNavigate();
  const referenceData = useReferenceData();
  const { userPermissions } = usePermissions();
  const { id } = useParams<{ id?: string }>();
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [editable, setEditable] = useState(true);
  const [isAddSupplierPopupOpen, setAddSupplierPopupOpen] = useState(false);
  const [isAddQuotePopupOpen, setAddQuotePopupOpen] = useState(false);
  const [isAddInvoicePopupOpen, setAddInvoicePopupOpen] = useState(false);
  const [isCancelInquiryPopupOpen, setCancelInquiryPopupOpen] = useState(false);
  const [isCloseInquiryPopupOpen, setCloseInquiryPopupOpen] = useState(false);
  const [isViewQuotePopupOpen, setViewQuotePopupOpen] = useState(false);
  const [isViewInvoicePopupOpen, setViewInvoicePopupOpen] = useState(false);
  const [isInvoicePaymentPopupOpen, setInvoicePaymentPopupOpen] = useState(false);
  const [isAddInvoice, setIsAddInvoice] = useState(false);
  const [isGrnQtyPopupOpen, setGrnQtyPopupOpen] = useState(false);
  const [isShippingQtyPopupOpen, setShippingQtyPopupOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(0);
  const [selectedInvoice, setSelectedInvoice] = useState(0);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [variantType, setVariantTypes] = useState<VariantType[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [modifiedData, setModifiedData] = useState<Inquiry | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [variantsToggle, setVariantsToggle] = useState(false);
  const [CustomizationToggle, setCustomizationToggle] = useState(false);
  const userData = useUserStore((state) => state.userData);

  useEffect(() => {
    if (
      !userPermissions.some(
        (permission) => permission.name === PERM_INQUIRY_VIEW
      )
    ) {
      // Redirect to a different page if the user doesn't have permission
      navigate("/inquiries");
    }

    // Set the initial state of the toggle based on the mock data
    setCustomizationToggle(Boolean(modifiedData?.customizations));
    if (userPermissions.some((permission) => permission.name === PERM_INQUIRY_CREATE)) {
      fetchVariantTypes();
    }
    fetchInquiry();
    if (userPermissions.some((permission) => permission.name === PERM_QUOTE_VIEW)) {
      fetchQuotes();
    }
    if (userPermissions.some((permission) => permission.name === PERM_INQUIRY_SUPPLIER_ASSIGN)) {
      fetchSuppliers();
    }
    if (userPermissions.some((permission) => permission.name === PERM_INVOICE_VIEW)) {
      fetchInvoices();
    }
  }, [id, userPermissions, modifiedData?.customizations, navigate]);

  const fetchInquiry = async () => {
    try {
      const responseData = await makeRequest("get", `${INQUIRYURL}/${id}`);
      if (responseData) {
        setInquiry(responseData.data);
        setModifiedData(responseData.data);

        if (STAGE_NO_QUOTE.includes(responseData.data.stage.id)) {
          // Do Nothing - Hidden
        }
        if (responseData.data.stage.id in EDITABLE_STAGES) {
          setEditable(false);
        } else {
          setEditable(true);
        }
      }
    } catch (error) {
      toast.error(`Something went wrong! ${error}`);
    }
  }

  const fetchVariantTypes = async () => {
    try {
      const variantData = await makeRequest(
        "get",
        `${INQUIRYURL}/variant/list`
      );
      if (variantData) {
        setVariantTypes(variantData.data);
      }
    } catch (error) {
      toast.error(`Something went wrong! ${error}`);
    }
  }

  const fetchQuotes = async () => {
    try {
      const quotesData = await makeRequest('get',
      `${INQUIRYURL}/${id}/quote/list`);
      if (quotesData) {
        setQuotes(quotesData.data);

        if (quotesData.data.length > 0) {
          setIsAddInvoice(true);
        }
      }
    } catch (error) {
      toast.error(`Something went wrong! ${error}`);
    }
  }

  const fetchInvoices = async () => {
    try {
      const invoiceData = await makeRequest('get',
      `${INQUIRYURL}/${id}/invoice/list`);
      if (invoiceData) {
        setInvoices(invoiceData.data);
      }
    } catch (error) {
      toast.error(`Something went wrong! ${error}`);
    }
  }

  const fetchSuppliers = async () => {
    try {
      const suppliersData = await makeRequest('get',
        `${INQUIRYURL}/${id}/supplier/list`);
      if (suppliersData) {
        setSuppliers(suppliersData.data);
      }
    } catch (error) {
      toast.error(`Something went wrong! ${error}`);
    }
  }

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (editMode) {
      const selectedFile = e.target.files && e.target.files[0];
      setSelectedImage(selectedFile || null);
    }
  };

  const renderImagePreview = () => {
    if (selectedImage) {
      return (
        <img
          src={URL.createObjectURL(selectedImage)}
          alt="Selected"
          className="uploaded-image"
        />
      );
    } else if (modifiedData?.image) {
      return (
        <img
          src={
            typeof modifiedData.image === "string"
              ? modifiedData.image
              : URL.createObjectURL(modifiedData.image)
          }
          alt="Uploaded"
          className="uploaded-image"
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

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    if (inquiry?.customizations) {
      setCustomizationToggle(true);
    }
    setModifiedData(inquiry);
  };

  const handleSave = () => {
    // Save the modified data
    // Implement your save logic here

    setEditMode(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setModifiedData((prevData) => ({
      ...prevData!,
      [e.target.name]: e.target.value,
    }));
  };

  const handleShippingTypeDropdownChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedShippingTypeId = e.target.value;
    const selectedShippingType = referenceData?.shippingType.find(
      (type) => type.id === selectedShippingTypeId
    );
    // setModifiedData((prevData) => ({
    //   ...prevData!,
    //   [shipping]: {
    //     id: selectedShippingTypeId,
    //     name: selectedShippingType?.name || ""
    //   },
    // }));
  };

  const handleCancelInquiry = async (reason: string) => {
    if (reason.length > 0) {
      const response = await makeRequest('put',
                                        `${INQUIRYURL}/${id}/cancel`,
                                        {'reason': reason},
                                        {"ngrok-skip-browser-warning": "69420"});
      if (response) {
        setCancelInquiryPopupOpen(false);
      }
    } else {
      toast.error('Please provide a reason to cancel inquiry');
    }
  };

  const handleCloseInquiry = async (reason: string) => {
    if (reason.length > 0) {
      const response = await makeRequest('put',
                                        `${INQUIRYURL}/${id}/close`,
                                        {'reason': reason},
                                        {"ngrok-skip-browser-warning": "69420"});
      if (response) {
        setCloseInquiryPopupOpen(false);
      }
    } else {
      toast.error('Please provide a reason to close inquiry');
    }
  };

  const handleGrnQty = async (quantity: number) => {
    try {
      const response = await makeRequest('put',
                                        `${INQUIRYURL}/${id}/update-grn`,
                                        {'grnQty': quantity});
      setGrnQtyPopupOpen(false);
      fetchInquiry();
    } catch (error) {
      toast.error(`Something went wrong! ${error}`);
    }
  }

  const handleShippingQty = async (quantity: number) => {
    try {
      const response = await makeRequest('put',
                                        `${INQUIRYURL}/${id}/update-shipping`,
                                        {'shippingQty': quantity});
      setShippingQtyPopupOpen(false);
      fetchInquiry();
    } catch (error) {
      toast.error(`Something went wrong! ${error}`);
    }
  }

  const handleVariantChange = (
    variantIndex: number,
    field: string,
    value: string
  ) => {
    setModifiedData((prevData) => {
      if (
        prevData &&
        prevData.variants &&
        prevData.variants.length > variantIndex
      ) {
        const updatedVariants = [...prevData.variants];
        updatedVariants[variantIndex] = {
          ...updatedVariants[variantIndex],
          [field]: value,
        };

        return {
          ...prevData,
          variants: updatedVariants,
        };
      }

      return prevData;
    });
  };

  const handleVariantImageUpload = (
    variantIndex: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (editMode) {
      const selectedFile = e.target.files && e.target.files[0];

      setModifiedData((prevData) => {
        const updatedVariants = [...(prevData?.variants || [])];
        const updatedVariant = {
          ...updatedVariants[variantIndex],
          variantImage: selectedFile ? selectedFile : "",
        };

        updatedVariants[variantIndex] = updatedVariant;

        return {
          ...prevData!,
          variants: updatedVariants,
        };
      });
    }
  };

  const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: "flex",
    "&:active": {
      "& .MuiSwitch-thumb": {
        width: 15,
      },
      "& .MuiSwitch-switchBase.Mui-checked": {
        transform: "translateX(9px)",
      },
    },
    "& .MuiSwitch-switchBase": {
      padding: 2,
      "&.Mui-checked": {
        transform: "translateX(12px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor:
            theme.palette.mode === "dark" ? "#177ddc" : "#1890ff",
        },
      },
    },
    "& .MuiSwitch-thumb": {
      boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
      width: 12,
      height: 12,
      borderRadius: 6,
      transition: theme.transitions.create(["width"], {
        duration: 200,
      }),
    },
    "& .MuiSwitch-track": {
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,.35)"
          : "rgba(0,0,0,.25)",
      boxSizing: "border-box",
    },
  }));

  const renderVariantImagePreview = (index: number) => {
    const variant = inquiry?.variants[index];

    if (variant?.image) {
      return (
        <img
          src={
            typeof variant.image === "string"
              ? variant.image
              : URL.createObjectURL(variant.image)
          }
          alt={`Variant ${index + 1} Image`}
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

  const handleAddVariant = () => {
    setModifiedData((prevData) => {
      const updatedVariants = [...(prevData?.variants || [])];

      const newVariant = {
        variantImage: "",
        variantId: `new-${updatedVariants.length}`, // You can generate a unique ID here
        variantShippingType: "", // Set to appropriate value
        variantDescription: "", // Set to appropriate value
      };

      // updatedVariants.push(newVariant);

      return {
        ...prevData!,
        variants: updatedVariants,
      };
    });
  };

  const handleDeleteVariant = (index: number) => {
    setModifiedData((prevData) => {
      if (prevData && prevData.variants && prevData.variants.length > index) {
        const updatedVariants = [...prevData.variants];
        updatedVariants.splice(index, 1);

        return {
          ...prevData,
          variants: updatedVariants,
        };
      }

      return prevData;
    });
  };

  const renderVariants = () => {
    if (modifiedData?.variants && modifiedData.variants.length > 0) {
      return modifiedData.variants.map((variant, index) => (
        <div>
          <div
            key={variant.id}
            className="w-full flex flex-row items-start justify-between gap-5 px-5 pt-5"
          >
            {editMode && (
              <div className="flex flex-col  w-2/5 relative pb-4 ">
                <span className="text-sm font-medium pb-1">{`Variant ${
                  index + 1
                } Type`}</span>
                <select
                  id="dropdown"
                  name="variantType"
                  value={variant?.type.id || ""}
                  // onChange={handleInputChange}
                  className="w-full  p-3 border rounded  text-gray-400 text-sm font-medium  focus:ring-1 focus:ring-gray-400 focus:outline-none appearance-none cursor-pointer "
                >
                  {variantType.map((item) => (
                    <option key={item?.id} value={item?.id}>
                      {item?.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center p-3 justify-center pointer-events-none pt-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="#0D8FFD"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </div>
              </div>
            )}

            <div
              className={`flex flex-col items-center ${
                editMode ? "w-1/5" : "w-full"
              }`}
            >
              <div className={`flex flex-col  ${editMode ? "" : "w-full"}`}>
                <span className="text-sm font-medium pb-1">Upload picture</span>
                <div
                  className={`flex  ${
                    editMode
                      ? "flex-col"
                      : "flex-row justify-start items-center gap-8 w-full"
                  }`}
                >
                  <label
                    htmlFor={`variantImageUpload-${index}`}
                    className="variant-image-upload-label flex justify-center items-center  w-36 h-24 p-3 border-[3px] border-dashed rounded text-sm font-medium focus:ring-1 focus:ring-gray-400 focus:outline-none"
                  >
                    <div className="variant-image-upload-container flex justify-center items-center flex-col ">
                      {renderVariantImagePreview(index)}
                    </div>
                    <input
                      type="file"
                      id={`variantImageUpload-${index}`}
                      accept="image/*"
                      onChange={(e) => handleVariantImageUpload(index, e)}
                      className="hidden"
                      disabled={!editMode}
                    />
                  </label>
                  {/* {!editMode && (
                    <div className="text-gray-400 text-sm font-medium ">
                      {variant.image && variant.image.length > 40
                        ? `${variant.image.slice(0, 40)}...`
                        : variant.image}
                    </div>
                  )} */}
                </div>
              </div>
            </div>
            {editMode && (
              <div className="flex flex-col items-center w-2/5">
                <div className="flex flex-col w-full ">
                  <span className="text-sm font-medium pb-1">{`Variant ${
                    index + 1
                  } Description`}</span>
                  <textarea
                    placeholder={`Variant ${index + 1} Description`}
                    value={variant.description || ""}
                    onChange={(e) =>
                      handleVariantChange(
                        index,
                        "variantDescription",
                        e.target.value
                      )
                    }
                    disabled={!editMode}
                    className="w-full  p-3 border rounded h-24 text-gray-400 text-sm font-medium  focus:ring-1 focus:ring-gray-400 focus:outline-none "
                  />
                </div>
              </div>
            )}
          </div>
          {editMode && (
            <div className="w-full flex justify-end pr-5">
              <button
                className="p-2 rounded text-red-500 hover:text-red-700"
                onClick={() => handleDeleteVariant(index)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ));
    }
    return null;
  };

  const openAddSupplierPopup = () => {
    setAddSupplierPopupOpen(true);
  };

  const closeAddSupplierPopup = () => {
    setAddSupplierPopupOpen(false);
    fetchInquiry();
    fetchSuppliers();
  };

  const openAddQuotePopup = () => {
    setAddQuotePopupOpen(true);
  };

  const closeAddQuotePopup = () => {
    setAddQuotePopupOpen(false);
    fetchInquiry();
    fetchQuotes();
  }

  const openCloseInquiryPopup = () => {
    setCloseInquiryPopupOpen(true);
  }

  const closeCloseInquiryPopup = () => {
    setCloseInquiryPopupOpen(false);
    fetchInquiry();
  }

  const openCancelInquiryPopup = () => {
    setCancelInquiryPopupOpen(true);
  }

  const closeCancelInquiryPopup = () => {
    setCancelInquiryPopupOpen(false);
    fetchInquiry();
  }
  
  const openViewQuotePopup = (id : any) => {
    setSelectedQuote(id)
    setViewQuotePopupOpen(true);
  }

  const closeViewQuotePopup = () => {
    setViewQuotePopupOpen(false);
    setSelectedQuote(0);
    fetchQuotes();
  }

  const openAddInvoicePopup = () => {
    setAddInvoicePopupOpen(true);
  }

  const closeAddInvoicePopup = () => {
    setAddInvoicePopupOpen(false);
    fetchInvoices();
  }

  const openViewInvoicePopup = (id : any) => {
    setSelectedInvoice(id);
    setViewInvoicePopupOpen(true);
  }

  const closeViewInvoicePopup = () => {
    setViewInvoicePopupOpen(false);
    setSelectedInvoice(0);
    fetchInvoices();
  }

  const openInvoicePaymentPopup = (id : any) => {
    setSelectedInvoice(id);
    setInvoicePaymentPopupOpen(true);
  }

  const closeInvoicePaymentPopup = () => {
    setInvoicePaymentPopupOpen(false);
    setSelectedInvoice(0);
    fetchInvoices();
  }

  const openGrnQtyInquiryPopup = () => {
    setGrnQtyPopupOpen(true);
  }

  const closeGrnQtyInquiryPopup = () => {
    setGrnQtyPopupOpen(false);
  }

  const openShippingQtyInquiryPopup = () => {
    setShippingQtyPopupOpen(true);
  }

  const closeShippingQtyInquiryPopup = () => {
    setShippingQtyPopupOpen(false);
  }

  return (
    <div className="w-full py-8 h-[90vh] overflow-y-auto">
      {!inquiry ? (
        <div className="container mx-auto h-full flex flex-col justify-between">
          <div className="rounded-[10px] shadow h-full flex items-center justify-center">
            <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            >
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div
            className=" rounded-[10px] flex flex-col mx-1"
            style={{ boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.05)" }}
          >
            <div className="inquiry-table-header flex flex-row justify-Center items-center w-full p-3 pb-6 gap-4 ">
              <Link to="/inquiries" className="text-[#0D8FFD]">
                <ArrowBackIcon />
              </Link>
              <div className="heading font-bold text-2xl">{inquiry?.name}</div>
            </div>
            <div className="inquiry-form w-full flex flex-col h-full overflow-y-auto">
              <div className="flex flex-row w-full">
                <div className="flex flex-col justify-between w-1/2 p-5">
                  <div className="flex flex-col w-full pb-4">
                    <span className="text-sm font-medium pb-1">
                      Product Name*
                    </span>
                    <input
                      type="text"
                      name="name"
                      placeholder="Product Name"
                      value={modifiedData?.name || ""}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      className={`w-full p-3 bg-white ${editMode ? 'border' : ''} rounded text-gray-400 text-sm font-medium focus:ring-1 focus:ring-gray-400 focus:outline-none`}
                    />
                  </div>
                  <div className="flex flex-col w-full pb-4">
                    <span className="text-sm font-medium pb-1">
                      Product Link
                    </span>
                    <input
                      type="text"
                      name="link"
                      placeholder="Paste URL"
                      value={modifiedData?.link || ""}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      className={`w-full p-3 bg-white ${editMode ? 'border' : ''} rounded text-gray-400 text-sm font-medium focus:ring-1 focus:ring-gray-400 focus:outline-none`}
                    />
                  </div>
                  <div className="flex flex-col w-full pb-4">
                    <span className="text-sm font-medium pb-1">
                      Detailed Description*
                    </span>
                    <textarea
                      name="description"
                      placeholder="Detailed Description"
                      value={modifiedData?.description || ""}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      className={`w-full p-3 bg-white ${editMode ? 'border' : ''} rounded text-gray-400 text-sm font-medium focus:ring-1 focus:ring-gray-400 focus:outline-none`}
                    />
                  </div>
                  <div className="flex flex-col w-full pb-4">
                    <span className="text-sm font-medium pb-1">
                      Target Price
                    </span>
                    <div className="relative mb-6">
                      <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">&euro;</div>
                      <input
                        type="text"
                        name="price"
                        placeholder="Target Price"
                        value={modifiedData?.price || ""}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        className={`w-full ps-10 p-3 bg-white ${editMode ? 'border' : ''} rounded text-gray-400 text-sm font-medium focus:ring-1 focus:ring-gray-400 focus:outline-none`}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col w-full pb-4">
                    <span className="text-sm font-medium pb-1">Quantity</span>
                    <input
                      type="number"
                      name="price"
                      placeholder="Quantity"
                      value={modifiedData?.quantity || ""}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      className={`w-full p-3 bg-white ${editMode ? 'border' : ''} rounded text-gray-400 text-sm font-medium focus:ring-1 focus:ring-gray-400 focus:outline-none`}
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-between w-1/2 p-5">
                  <div className="flex flex-col  pb-4">
                    <span className="text-sm font-medium pb-1">
                      Upload Picture
                    </span>
                    <label
                      htmlFor="imageUpload"
                      className="image-upload-label flex justify-center items-center w-56 h-56 p-3 border-[3px] border-dashed rounded text-sm font-medium focus:ring-1 focus:ring-gray-400 focus:outline-none"
                    >
                      <div className="image-upload-container flex justify-center items-center flex-col ">
                        {renderImagePreview()}
                      </div>
                      <input
                        type="file"
                        id="imageUpload"
                        disabled={!editMode}
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="flex flex-col w-full pb-4">
                    <span className="text-sm font-medium pb-1">Notes*</span>
                    <textarea
                      placeholder="Notes"
                      name="notes"
                      value={modifiedData?.notes || ""}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      className={`w-full p-3 bg-white ${editMode ? 'border' : ''} rounded h-28 text-gray-400 text-sm font-medium focus:ring-1 focus:ring-gray-400 focus:outline-none`}
                    />
                  </div>
                  <div className="flex flex-col w-full pb-4 relative">
                    <span className="text-sm font-medium pb-1">
                      Shipping Type/s*
                    </span>
                    <select
                      id="dropdown"
                      name=""
                      value={modifiedData?.shipping.id || ""}
                      onChange={handleShippingTypeDropdownChange}
                      disabled={!editMode}
                      className={`w-full p-3 bg-white ${editMode ? 'border' : ''} rounded text-gray-400 text-sm font-medium focus:ring-1 focus:ring-gray-400 focus:outline-none appearance-none cursor-pointer`}
                    >
                      <option>Select Shipping Type</option>
                      {Object.values(referenceData?.shippingType || {}).map(
                        (shipping) => (
                          <option key={shipping.id} value={shipping.id}>
                            {shipping.name}
                          </option>
                        )
                      )}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center p-3 justify-center pointer-events-none pt-5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="#0D8FFD"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full flex p-5 flex-col">
                <div className="w-1/2 flex flex-col justify-center items-center py-5">
                  <div className="flex w-full justify-between pb-4">
                    <span className="text-sm font-medium">Customizations</span>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <AntSwitch
                        checked={CustomizationToggle}
                        onChange={() =>
                          setCustomizationToggle(!CustomizationToggle)
                        }
                        inputProps={{ "aria-label": "ant design" }}
                        disabled={!editMode}
                      />
                    </Stack>
                  </div>
                </div>

                <div className="w-1/2 flex flex-col justify-center items-center py-5">
                  <div className="flex flex-col w-full justify-between pb-4">
                    <span className="text-sm font-medium pb-1">
                      Customization Description
                    </span>
                    <textarea
                      name="customizations"
                      onChange={handleInputChange}
                      placeholder="Customisation Description"
                      value={modifiedData?.customizations || ""}
                      disabled={!editMode || !CustomizationToggle}
                      className={`w-full p-3 bg-white ${editMode ? 'border' : ''} rounded h-24 text-gray-400 text-sm font-medium focus:ring-1 focus:ring-gray-400 focus:outline-none`}
                    />
                  </div>
                </div>

                <div className="">
                  {modifiedData?.variants &&
                    modifiedData.variants.length > 0 && (
                      <span className="text-sm font-medium leading-none">
                        Variants
                      </span>
                    )}
                  {renderVariants()}
                  {editMode && (
                    <button
                      onClick={handleAddVariant}
                      className="p-2 rounded w-full items-center justify-center flex flex-row gap-3 text-[#0D8FFD] text-base font-medium"
                    >
                      Add Variant
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="#0D8FFD"
                        className="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {editMode ? (
                <div className="w-full flex flex-row justify-end gap-4 p-5">
                  <RedButtonOutlined
                    onClick={handleCancel}
                    text="Cancel"
                    buttonType="button"
                  />
                  <PrimaryButton
                    onClick={handleSave}
                    text="Save Changes"
                    buttonType="button"
                  />
                </div>
              ) : (
                <div className="edit-buttons flex w-full justify-end gap-4 p-5">
                  {userPermissions.some((permission) => permission.name === PERM_INQUIRY_GRN_UPDATE)
                    && (STAGE_UPDATE_GRN.includes(inquiry?.stage.id)) && (
                    <PrimaryButton
                      onClick={openGrnQtyInquiryPopup}
                      text="Update GRN Quantity"
                      buttonType="button"
                    />
                  )}

                  {userPermissions.some((permission) => permission.name === PERM_INQUIRY_SHIPPING_UPDATE)
                    && (STAGE_UPDATE_SHIPPING.includes(inquiry?.stage.id)) && (
                    <PrimaryButton
                      onClick={openShippingQtyInquiryPopup}
                      text="Update Shipping Quantity"
                      buttonType="button"
                    />
                  )}

                  {(userPermissions.some(
                    (Permission) => Permission.name === PERM_INQUIRY_CANCEL
                  ) && inquiry.stage.id !== STAGE_CANCELLED && inquiry.stage.id < STAGE_INVOICED) && (
                    <RedButtonOutlined
                      onClick={openCancelInquiryPopup}
                      text="Cancel Inquiry"
                      buttonType="button"
                    />
                  )}
                  {(userPermissions.some(
                    (permission) => permission.name === PERM_INQUIRY_CLOSE
                  ) && inquiry.stage.id !== STAGE_CLOSED) && (
                    <RedButtonOutlined
                      onClick={openCloseInquiryPopup}
                      text="Close Inquiry"
                      buttonType="button"
                    />
                  )}
                  {(userPermissions.some(
                    (permission) => permission.name === PERM_INQUIRY_EDIT
                  ) && userData?.id == inquiry.createdBy.id && inquiry.stage.id in EDITABLE_STAGES) && (
                    <PrimaryButton
                    onClick={handleEdit}
                    text="Edit Inquiry"
                    buttonType="button"
                    disabled={editable}
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {userPermissions.some(
            (permission) => permission.name === PERM_QUOTE_VIEW
          ) ? (
            <>
              <div
                className="my-8 rounded-[10px] flex flex-col mx-1"
                style={{ boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.05)" }}
              >
                <div className="w-full flex flex-col p-5 rounded-[10px]">
                  <div className="w-full flex flex-row justify-between pb-4 items-center">
                    <span className="text-lg font-medium">All Quotes</span>
                    {(userPermissions.some(
                      (permission) => permission.name === PERM_QUOTE_CREATE
                    ) && !(STAGE_NO_QUOTE.includes(inquiry.stage.id)))? (
                      <button
                        className="flex flex-row-reverse gap-2  rounded p-2 text-[#0D8FFD]"
                        onClick={openAddQuotePopup}
                      >
                        Add Quote
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                          />
                        </svg>
                      </button>
                    ) : (
                      <></>
                    )}
                  </div>
                  <hr />
                  {quotes && quotes.length > 0 ? (
                    <div className="container max-auto h-full flex flex-col justify-between">
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead className="top-0 bg-white text-base">
                            <tr>
                              <th className="border-b-2 border-blue-300 border-opacity-60 p-2 cursor-pointer">Supplier</th>
                              <th className="border-b-2 border-blue-300 border-opacity-60 p-2 cursor-pointer">Product Name</th>
                              <th className="border-b-2 border-blue-300 border-opacity-60 p-2 cursor-pointer">Found Price</th>
                              <th className="border-b-2 border-blue-300 border-opacity-60 p-2 cursor-pointer">In Stock</th>
                              <th className="border-b-2 border-blue-300 border-opacity-60 p-2 cursor-pointer">Status</th>
                              <th className="border-b-2 border-blue-300 border-opacity-60 p-2 cursor-pointer">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {quotes.map((row, index) => (
                              <tr key={index}>
                                <td className="border-b border-[#f6f6f6] p-2 text-center">{row?.supplier.name}</td>
                                <td className="border-b border-[#f6f6f6] p-2 text-center">{row?.productName}</td>
                                <td className="border-b border-[#f6f6f6] p-2 text-center">{row?.foundPrice}</td>
                                <td className="border-b border-[#f6f6f6] p-2 text-center">{row?.inStock == 1 ? 'Yes' : 'No'}</td>
                                <td className="border-b border-[#f6f6f6] p-2 text-center">
                                  <span className={`inline-block px-2 pb-1 rounded ${getStatusColor(row?.status.name)}`} style={{ maxWidth: "fit-content"}}>
                                    {row?.status.name}
                                  </span>
                                </td>
                                <td className="border-b border-[#f6f6f6] p-2 text-center">
                                  <FontAwesomeIcon
                                    onClick={() => openViewQuotePopup(row.id)}
                                    icon={faEye}
                                    className="h-4 w-4 text-blue-500"
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="container mx-auto h-full flex items-center justify-center">
                      <h2 className="text-md dark:text-gray-600 py-5">This inquiry has no quotes.</h2>
                    </div>
                  )}
                </div>
              </div>
              {isAddQuotePopupOpen && (
                <div className="overlay">
                  <AddQuotePopup onClose={closeAddQuotePopup} data={inquiry}/>
                </div>
              )}
            </>
          ) : (
            <></>
          )}

          {userPermissions.some(
            (permission) => permission.name === PERM_INVOICE_VIEW
          ) ? (
            <>
              <div
                className="my-8 rounded-[10px] flex flex-col mx-1"
                style={{ boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.05)" }}
              >
                <div className="w-full flex flex-col p-5 rounded-[10px]">
                  <div className="w-full flex flex-row justify-between pb-4 items-center">
                    <span className="text-lg font-medium">All Invoices</span>
                    {(userPermissions.some(
                      (permission) => permission.name === PERM_INVOICE_CREATE
                    ) && isAddInvoice && !(STAGE_NO_INVOICE.includes(inquiry.stage.id)))? (
                      <button
                        className="flex flex-row-reverse gap-2  rounded p-2 text-[#0D8FFD]"
                        onClick={openAddInvoicePopup}
                      >
                        Add Invoice
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                          />
                        </svg>
                      </button>
                    ) : (
                      <></>
                    )}
                  </div>
                  <hr />
                  {invoices && invoices.length > 0 ? (
                    <div className="container max-auto h-full flex flex-col justify-between">
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead className="top=0 bg-white text-base">
                            <tr>
                              <th className="border-b-2 border-blue-300 border-opacity-60 p-2 cursor-pointer">Quote</th>
                              <th className="border-b-2 border-blue-300 border-opacity-60 p-2 cursor-pointer">Supplier</th>
                              <th className="border-b-2 border-blue-300 border-opacity-60 p-2 cursor-pointer">Status</th>
                              <th className="border-b-2 border-blue-300 border-opacity-60 p-2 cursor-pointer">Payment Status</th>
                              <th className="border-b-2 border-blue-300 border-opacity-60 p-2 cursor-pointer">Payment Channel</th>
                              <th className="border-b-2 border-blue-300 border-opacity-60 p-2 cursor-pointer">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {invoices.map((row, index) => (
                              <tr key={index}>
                                <td className="border-b border-[#f6f6f6] p-2 text-center">ID #{row?.quoteId}</td>
                                <td className="border-b border-[#f6f6f6] p-2 text-center">{quotes.find(quote => quote.id === row?.quoteId)?.supplier.name}</td>
                                <td className="border-b border-[#f6f6f6] p-2 text-center">
                                  <span className={`inline-block px-2 pb-1 rounded ${getStatusColor(row?.status.name)}`} style={{ maxWidth: "fit-content"}}>
                                    {row?.status.name}
                                  </span>
                                </td>
                                <td className="border-b border-[#f6f6f6] p-2 text-center">
                                  <span className={`inline-block px-2 pb-1 rounded ${getStatusColor(row?.payment.name)}`} style={{ maxWidth: "fit-content"}}>
                                    {row?.payment.name}
                                  </span>
                                </td>
                                <td className="border-b border-[#f6f6f6] p-2 text-center">{row?.payment.channel.name || 'N/A'}</td>
                                <td className="border-b border-[#f6f6f6] p-2 text-center gap-4">
                                  <div className="mx-2">
                                      <FontAwesomeIcon
                                        onClick={() => openViewInvoicePopup(row?.id)}
                                        icon={faEye}
                                        className="h-4 w-4 text-blue-500"
                                      />
                                  </div>
                                  <div className="mx-2">
                                    {inquiry.stage.id === STAGE_INVOICED || inquiry.stage.id === STAGE_ACCEPTED && (
                                    <FontAwesomeIcon
                                      onClick={() => openInvoicePaymentPopup(row?.id)}
                                      icon={faCreditCard}
                                      className="h-4 w-4 text-blue-500"
                                    />
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="container mx-auto h-full flex items-center justify-center">
                      <h2 className="text-md dark:text-gray-600 py-5">This inquiry has no invoices.</h2>
                    </div>
                  )}
                </div>
              </div>
              {isAddInvoicePopupOpen && (
                <div className="overlay">
                  <AddInvoicePopup onClose={closeAddInvoicePopup} data={inquiry.id}/>
                </div>
              )}
              {isViewInvoicePopupOpen && (
                <div className="overlay">
                  <ViewInvoicePopup onClose={closeViewInvoicePopup} data={selectedInvoice}/>
                </div>
              )}
              {isInvoicePaymentPopupOpen && (
                <div className="overlay">
                  <InvoicePayment onClose={closeInvoicePaymentPopup} data={selectedInvoice}/>
                </div>
              )}
            </>
          ) : (
            <></>
          )}

          {userPermissions.some(
            (permission) => permission.name === PERM_INQUIRY_SUPPLIER_ASSIGN
          ) ? (
            <>
              <div
                className="my-8 rounded-[10px] flex flex-col mx-1"
                style={{ boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.05)" }}
              >
                <div className="w-full flex flex-col p-5 rounded-[10px]">
                  <div className="w-full flex flex-row justify-between pb-4 items-center">
                    <span className="text-lg font-medium">Suppliers</span>
                    {!(STAGE_NO_SUPPLIER.includes(inquiry.stage.id)) && (
                      <button
                        className="flex flex-row-reverse gap-2 rounded p-2 text-[#0D8FFD]"
                        onClick={openAddSupplierPopup}
                      >
                        Add Supplier
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                  <hr />
                  {suppliers && suppliers.length > 0 ? (
                    <div className="container mx-auto h-full flex flex-col justify-between">
                      <div className="overflow-x-auto py-5">
                        <table className="min-w-full">
                          <thead className="top-0 bg-white text-base">
                            <tr>
                              <th className="border-b-2 border-blue-300 border-opacity-60  p-2 cursor-pointer">
                                Supplier Name
                              </th>
                              <th className="border-b-2 border-blue-300 border-opacity-60  p-2 cursor-pointer">
                                Description
                              </th>
                              <th className="border-b-2 border-blue-300 border-opacity-60  p-2 cursor-pointer">
                                Phone
                              </th>
                              <th className="border-b-2 border-blue-300 border-opacity-60  p-2 cursor-pointer">
                                Email
                              </th>
                            </tr>
                          </thead>
                          <tbody className="text-sm">
                            {suppliers.map((row, index) => (
                              <tr key={index}>
                                <td className="border-b border-[#f6f6f6] p-2 text-center">
                                  {row?.supplier.name}
                                </td>
                                <td className="border-b border-[#f6f6f6] p-2 text-center">
                                  {row.supplier.description}
                                </td>
                                <td className="border-b border-[#f6f6f6] p-2 text-center">
                                  {row.user.phone}
                                </td>
                                <td className="border-b border-[#f6f6f6] p-2 text-center">
                                  {row.user.email}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="container mx-auto h-full flex items-center justify-center">
                      <h2 className="text-md dark:text-gray-600 py-5">This inquiry has no suppliers.</h2>
                    </div>
                  )}
                </div>
              </div>
              {isAddSupplierPopupOpen && (
                <div className="overlay">
                  <AddSupplierPopup onClose={closeAddSupplierPopup} />
                </div>
              )}
            </>
          ) : (
            <></>
          )}

          {isCloseInquiryPopupOpen || isCancelInquiryPopupOpen ? (
            <div className="overlay">
              <ActionInquiry
                onClose={isCloseInquiryPopupOpen ? closeCloseInquiryPopup : closeCancelInquiryPopup}
                title={isCloseInquiryPopupOpen ? 'Close Inquiry' : 'Cancel Inquiry'}
                handleAction={isCloseInquiryPopupOpen ? handleCloseInquiry : handleCancelInquiry}
              />
            </div>
          ) : null}

          {userPermissions.some((permission) => permission.name === PERM_INQUIRY_GRN_UPDATE)
            && (STAGE_UPDATE_GRN.includes(inquiry?.stage.id)) && (isGrnQtyPopupOpen) &&
            <div className="overlay">
              <QuantityInquiry
                onClose={closeGrnQtyInquiryPopup}
                title = {'Update GRN Qty'}
                handleAction={handleGrnQty}
              />
            </div>
          }

          {userPermissions.some((permission) => permission.name === PERM_INQUIRY_SHIPPING_UPDATE)
            && (STAGE_UPDATE_SHIPPING.includes(inquiry?.stage.id)) && (isShippingQtyPopupOpen) &&
            <div className="overlay">
              <QuantityInquiry
                onClose={closeShippingQtyInquiryPopup}
                title={'Update Shipping Qty'}
                handleAction={handleShippingQty}
              />
            </div>
          }

          {isViewQuotePopupOpen && (
            <div className="overlay">
              <ViewQuotePopup
                onClose={closeViewQuotePopup}
                data={selectedQuote}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EditInquiry;

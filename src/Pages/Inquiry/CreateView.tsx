import React, { useState, ChangeEvent, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Switch, { SwitchProps } from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Inquiry from "../../Interface/Inquiry";
import { shippingTypeData, serviceData } from "../../DropDownData/DropDownData";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../../Components/PrimaryButton";
import { useReferenceData } from "../../Service/ReferenceDataContext";
import { makeRequest } from "../../Service/api";
import { INQUIRYURL } from "../../Constants/api";
import { toast } from "react-toastify";
import { VariantType } from "../../Interface/VariantType";
import { Variant } from "../../Interface/Variant";

const CreateInquiryView = () => {
  const navigate = useNavigate();
  const referenceData = useReferenceData();
  const initialInquiryState: Inquiry = {
    createdBy: {
      email: "",
      id: 1,
      name: "",
      phone: "",
    },
    customizations: "",
    description: "",
    id: 0,
    image: null,
    link: "",
    name: "",
    notes: "",
    price: "",
    quantity: "",
    service: {
      id: 0,
      name: "",
    },
    shipping: {
      id: 0,
      name: "",
    },
    stage: {
      id: 0,
      name: "",
    },
    variants: [],
  };
  const [isDisabled, setIsDisabled] = useState(false);
  const [variantTypes, setVariantTypes] = useState<VariantType[]>([])
  const [newInquiry, setNewInquiry] = useState<Inquiry>(initialInquiryState);

  const [variantsToggle, setVariantsToggle] = useState(false);
  const [CustomizationToggle, setCustomizationToggle] = useState(false);
  const [addVariants, setAddVariants] = useState<Variant[]>([]);
  
  useEffect(() => {
    fetchVariantTypes();
  }, []);

  const fetchVariantTypes = async () => {
    try {
      const responseData = await makeRequest('get',
                                            `${INQUIRYURL}/variant/list`);
      if (responseData) {
        setVariantTypes(responseData.data)
      }
    } catch (error) {
      toast.error(`Something went wrong! ${error}`);
    }
  }
  const handleGoBack = () => {
    navigate('/inquiries');
    // window.history.back(); // Navigate back using browser's history
  };

  const handleShippingTypeDropdownChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedShippingTypeId = e.target.value;
    const selectedShippingType = referenceData?.shippingType.find(
      (type) => type.id === selectedShippingTypeId
    );
    setNewInquiry({
      ...newInquiry,
      shipping: {
        id: parseInt(selectedShippingTypeId, 10),
        name: selectedShippingType?.name || "",
      },
    });
  };

  const handleVariantShippingTypeDropdownChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    variantIndex: number
  ) => {
    const selectedShippingTypeId = e.target.value;
    const selectedShippingType = shippingTypeData.find(
      (type) => type.id === parseInt(selectedShippingTypeId, 10)
    );

    // Update the variant object in addVariants state
    const updatedVariants = [...addVariants];
    updatedVariants[variantIndex].type = {
      id: parseInt(selectedShippingTypeId, 10),
      name: selectedShippingType?.name || "",
    };
    setAddVariants(updatedVariants);

    // Update the newInquiry object with the selected shipping type
    setNewInquiry((prevInquiry) => {
      const updatedVariants = [...prevInquiry.variants];
      updatedVariants[variantIndex] = {
        ...updatedVariants[variantIndex],
        type: {
          id: parseInt(selectedShippingTypeId, 10),
          name: selectedShippingType?.name || "",
        },
      };

      return {
        ...prevInquiry,
        variants: updatedVariants,
      };
    });
  };

  const handleServiceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedServiceId = event.target.value;
    const selectedService = serviceData.find(
      (service) => service.id === parseInt(selectedServiceId, 10)
    );
  
    setNewInquiry((prevInquiry) => ({
      ...prevInquiry,
      service: {
        id: parseInt(selectedServiceId, 10),
        name: selectedService?.name || "",
      },
    }));
  };

  const handleCreate = async () => {
    setIsDisabled(true);
    try {
      let formData = new FormData();
      formData.append("productName", newInquiry.name);
      formData.append("productLink", newInquiry.link);
      formData.append("productDesc", newInquiry.description);
      if (newInquiry.image instanceof Blob) {
        formData.append("image", newInquiry.image);
      }
      if (newInquiry.notes) {
        formData.append("productNotes", newInquiry.notes);
      }
      formData.append("targetPrice", newInquiry.price);
      formData.append("productQuantity", newInquiry.quantity);
      formData.append("shippingType", newInquiry.shipping.id.toString());
      formData.append("serviceId", newInquiry.service.id.toString());
      formData.append("customizations", newInquiry.customizations || "");
      formData.append("variant_count", newInquiry.variants.length.toString());

      newInquiry.variants.forEach((variant, index) => {
        // If atleast one of the values is present, all values should be present
        if (variant.image instanceof Blob || variant.description || variant.type) {
          if (!(variant.image instanceof Blob)) {
            toast.warn(`Variant image missing`);
            setIsDisabled(false);
            return
          }

          if (!variant.description) {
            toast.warn(`Variant description missing`);
            setIsDisabled(false);
            return
          }

          if (!variant.type) {
            toast.warn(`Variant type missing`);
            setIsDisabled(false);
            return
          }
        }

        if (variant.image instanceof Blob) {
          formData.append(`variant_image_${index + 1}`, variant.image);
        }
        formData.append(`variant_description_${index + 1}`, variant.description || "");
        formData.append(
          `variant_type_${index + 1}`,
          variant.type.id.toString()
        );
      });

      // Send POST request
      const responseData = await makeRequest('post',
                                             `${INQUIRYURL}/`,
                                             formData,
                                             {"ngrok-skip-browser-warning": "69420"});
      if (responseData.result) {
        navigate(`/inquiries`);
      }

    } catch (error) {
      toast.error(`Something went wrong! ${error}`);
    }
    setIsDisabled(false);
  };

  const handleVariantDescriptionInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    variantIndex: number
  ) => {
    // Update the variant object in addVariants state
    const updatedVariants = [...addVariants];
    updatedVariants[variantIndex].description = e.target.value;
    setAddVariants(updatedVariants);

    // Update the newInquiry object with the selected shipping type
    setNewInquiry((prevInquiry) => {
      const updatedVariants = [...prevInquiry.variants];
      updatedVariants[variantIndex] = {
        ...updatedVariants[variantIndex],
        description: e.target.value,
      };

      return {
        ...prevInquiry,
        variants: updatedVariants,
      };
    });
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    setNewInquiry((prevInquiry) => ({
      ...prevInquiry,
      image: selectedFile,
    }));
  };

  const handleVariantImageUpload = (
    e: ChangeEvent<HTMLInputElement>,
    variantIndex: number
  ) => {
    const selectedFile = e.target.files && e.target.files[0];

    // Update the state only for the specific variant index
    setAddVariants((prevVariants) => {
      const newVariants = [...prevVariants];
      // console.log('All');console.log(newVariants);
      // console.log('Before');console.log(newVariants[variantIndex]);
      newVariants[variantIndex].image = selectedFile;
      // console.log('After');console.log(newVariants[variantIndex]);
      return newVariants;
    });

    // Update the newInquiry object with the selected shipping type
    setNewInquiry((prevInquiry) => {
      const updatedVariants = [...prevInquiry.variants];
      updatedVariants[variantIndex] = {
        ...updatedVariants[variantIndex],
        image: selectedFile,
      };

      return {
        ...prevInquiry,
        variants: updatedVariants,
      };
    });
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

  const renderImagePreview = () => {
    if (newInquiry.image) {
      return (
        <img src={typeof newInquiry.image === 'string' ? newInquiry.image : URL.createObjectURL(newInquiry.image)}
             alt="Selected"
             className="uploaded-image"
             width="50"/>
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewInquiry({
      ...newInquiry,
      [e.target.name]: e.target.value,
    });
  };

  const renderVariantImagePreview = (variantIndex: number) => {
    const selectedVariantImage = addVariants[variantIndex].image;

    if (selectedVariantImage) {
      return (
        <img
          src={typeof selectedVariantImage === 'string' ? selectedVariantImage : URL.createObjectURL(selectedVariantImage)}
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

  const handleAddVariant = () => {
    // Create a new variant with an automatically assigned ID
    const newVariant = {
      id: addVariants.length + 1, // Assign ID based on the length of existing variants
      description: "",
      image: "",
      type: { id: 0, name: "" },
    };

    // Update the addVariants state with the new variant
    setAddVariants((prevVariants) => [...prevVariants, newVariant]);

    // Update the newInquiry object with the added variant
    setNewInquiry((prevInquiry) => ({
      ...prevInquiry,
      variants: [...prevInquiry.variants, newVariant],
    }));
  };

  const [selectedValue, setSelectedValue] = React.useState("a");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  const handleVariantsToggleChange = () => {
    setVariantsToggle(!variantsToggle);

    if (!variantsToggle) {
      // Toggle is turned on, no default variant is added
      setAddVariants([]);
    } else {
      // Toggle is turned off, remove all variants
      setAddVariants([]);

      // Update the newInquiry object with no variants
      setNewInquiry((prevInquiry) => ({
        ...prevInquiry,
        variants: [],
      }));
    }
  };

  const controlProps = (item: string) => ({
    checked: selectedValue === item,
    onChange: handleChange,
    value: item,
    name: "color-radio-button-demo",
    inputProps: { "aria-label": item },
  });

  return (
    <div className="w-full pt-8 h-[90vh]  ">
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
          <div className="heading font-bold text-2xl">Create Inquiry</div>
        </div>
        <div
          className="inquiry-form w-full flex flex-col h-full overflow-y-auto"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#888 #f1f1f1",
            animation: "scrollbarAnimation 0.5s ease-in-out",
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div className="flex flex-row w-full">
            <div className="flex flex-col justify-between w-1/2 p-5">
              <div className="flex flex-col w-full pb-4">
                <span className="text-sm font-medium pb-1">Product Name*</span>
                <input
                  type="text"
                  placeholder="Product Name"
                  value={newInquiry.name}
                  onChange={handleInputChange}
                  name="name"
                  className="w-full  p-3 border rounded text-gray-400 text-sm font-medium  focus:ring-1 focus:ring-gray-400 focus:outline-none "
                  required
                />
              </div>
              <div className="flex flex-col w-full pb-4">
                <span className="text-sm font-medium pb-1">Product Link</span>
                <input
                  type="text"
                  placeholder="Paste URL"
                  value={newInquiry.link}
                  onChange={handleInputChange}
                  name="link"
                  className="w-full  p-3 border rounded text-gray-400 text-sm font-medium  focus:ring-1 focus:ring-gray-400 focus:outline-none "
                />
              </div>
              <div className="flex flex-col w-full pb-4">
                <span className="text-sm font-medium pb-1">
                  Detailed Description*
                </span>
                <textarea
                  placeholder="Detailed Description"
                  value={newInquiry.description}
                  onChange={handleInputChange}
                  name="description"
                  className="w-full  p-3 border rounded h-28 text-gray-400 text-sm font-medium  focus:ring-1 focus:ring-gray-400 focus:outline-none "
                  required
                />
              </div>
              <div className="flex flex-col w-full pb-4">
                <span className="text-sm font-medium pb-1">Target Price</span>
                <div className="relative mb-6">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">&euro;</div>
                  <input
                    type="number"
                    placeholder="Target Price"
                    value={newInquiry.price}
                    onChange={handleInputChange}
                    name="price"
                    className="block ps-10 w-full p-3 border rounded text-gray-400 text-sm font-medium focus:ring-1 focus:ring-gray-400 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex flex-col w-full pb-4">
                <span className="text-sm font-medium pb-1">Quantity</span>
                <input
                  type="number"
                  placeholder="Quantity"
                  value={newInquiry.quantity}
                  onChange={handleInputChange}
                  name="quantity"
                  className="w-full  p-3 border rounded text-gray-400 text-sm font-medium  focus:ring-1 focus:ring-gray-400 focus:outline-none "
                />
              </div>
            </div>
            <div className="flex flex-col justify-between w-1/2 p-5">
              <div className="flex flex-col  pb-4">
                <span className="text-sm font-medium pb-1">Upload Picture</span>
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
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    required
                  />
                </label>
              </div>
              <div className="flex flex-col w-full pb-4">
                <span className="text-sm font-medium pb-1">Notes</span>
                <textarea
                  placeholder="Notes"
                  value={newInquiry.notes}
                  onChange={handleInputChange}
                  name="notes"
                  className="w-full  p-3 border rounded h-28 text-gray-400 text-sm font-medium  focus:ring-1 focus:ring-gray-400 focus:outline-none "
                />
              </div>
              <div className="flex flex-col w-full pb-4 relative">
                <span className="text-sm font-medium pb-1">
                  Shipping Types*
                </span>
                <select
                  id="dropdown"
                  value={newInquiry.shipping.id || ""}
                  onChange={handleShippingTypeDropdownChange}
                  className="w-full p-3 border rounded text-gray-400 text-sm font-medium focus:ring-1 focus:ring-gray-400 focus:outline-none appearance-none cursor-pointer"
                  required
                >
                  <option>
                    Select Shipping Type
                  </option>
                  {Object.values(referenceData?.shippingType || {}).map((shipping) => (
                    <option key={shipping.id} value={shipping.id}>
                      {shipping.name}
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
            </div>
          </div>
          <div className="flex flex-col w-full items-start px-5">
            <FormControl>
              <FormLabel
                id="demo-radio-buttons-group-label"
                sx={{
                  fontSize: "0.875rem",
                  lineHeight: "1.25rem",
                  fontFamily: "'Satoshi', sans-serif",
                  fontWeight: 500,
                  color: "#000000 !important", // Set the color explicitly
                }}
              >
                Services
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue=""
                name="radio-buttons-group"
                onChange={handleServiceChange}
              >
                {Object.values(referenceData?.service || {}).map((service) => (
                  <>
                    <FormControlLabel
                      key={service.id}
                      value={service.id}
                      control={<Radio sx={{ color: "#0D8FFD"}}/>}
                      label={
                        <div className="group relative m-2 flex justify-center">
                          <span className="text-sm font-medium font-satoshi">
                            {service.name}
                            <button className="text-md pl-2 text-[#0D8FFD]"><FontAwesomeIcon icon={faCircleInfo}/></button>
                            <span className="absolute top-5 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100 z-50 w-full">
                              {service.description}
                            </span>
                          </span>
                        </div>
                      }
                    />
                  </>
                ))}
              </RadioGroup>
            </FormControl>

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
                  />
                </Stack>
              </div>
              {CustomizationToggle && (
                <div className="flex flex-col w-full justify-between pb-4">
                  <span className="text-sm font-medium pb-1">
                    Customization Description
                  </span>
                  <textarea
                    placeholder="Customisation Description"
                    value={newInquiry.customizations}
                    name="customizations"
                    onChange={handleInputChange}
                    className="w-full  p-3 border rounded h-24 text-gray-400 text-sm font-medium  focus:ring-1 focus:ring-gray-400 focus:outline-none "
                  />
                </div>
              )}
              <div className="flex w-full justify-between">
                <span className="text-sm font-medium">Variants</span>
                <Stack direction="row" spacing={1} alignItems="center">
                  <AntSwitch
                    checked={variantsToggle}
                    onChange={handleVariantsToggleChange}
                    inputProps={{ "aria-label": "ant design" }}
                  />
                </Stack>
              </div>
            </div>
            <div className="variants-section w-full flex flex-rox justify-center items-center py-5 ">
              {variantsToggle && (
                <div className="w-full">
                  {addVariants.map(
                    (variant, index) => (
                      (
                        <div key={index} className="w-full">
                          <div className="w-full flex flex-row items-start justify-between gap-5 pb-5">
                            <div className="flex flex-col  w-2/5 relative pb-4 ">
                              <span className="text-sm font-medium pb-1">
                                Variant Type
                              </span>
                              <select
                                id="dropdown"
                                onChange={(e) =>
                                  handleVariantShippingTypeDropdownChange(
                                    e,
                                    index
                                  )
                                }
                                value={variant.type.id || ""}
                                className="w-full  p-3 border rounded  text-gray-400 text-sm font-medium  focus:ring-1 focus:ring-gray-400 focus:outline-none appearance-none cursor-pointer "
                              >
                                <option>
                                  Select Variant Type
                                </option>
                                {variantTypes.map((type) => (
                                  <option key={type.id} value={type.id}>
                                    {type.name}
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
                            <div className="flex flex-col items-center w-1/5">
                              <div className="flex flex-col  pb-4">
                                <span className="text-sm font-medium pb-1">
                                  Variant Picture
                                </span>
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
                                    onChange={(e) =>
                                      handleVariantImageUpload(e, index)
                                    }
                                    className="hidden"
                                  />
                                </label>
                              </div>
                            </div>
                            <div className="flex flex-col items-center w-2/5">
                              <div className="flex flex-col w-full pb-4">
                                <span className="text-sm font-medium pb-1">
                                  Variant Description
                                </span>
                                <textarea
                                  placeholder="Variant Description"
                                  value={variant!.description || ''}
                                  onChange={(
                                    e: React.ChangeEvent<HTMLTextAreaElement>
                                  ) =>
                                    handleVariantDescriptionInputChange(
                                      e,
                                      index
                                    )
                                  }
                                  className="w-full  p-3 border rounded h-24 text-gray-400 text-sm font-medium  focus:ring-1 focus:ring-gray-400 focus:outline-none "
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    )
                  )}

                  {newInquiry.variants.length > 0 && (
                    <hr className="border-gray-100 border" />
                  )}
                  <button
                    onClick={handleAddVariant}
                    className="  p-2 rounded w-full items-center justify-center flex flex-row gap-3 text-[#0D8FFD] text-base font-medium"
                  >
                    Add Variant
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
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
                </div>
              )}
            </div>
            <div className="quote-actions w-full flex justify-end gap-8 mt-6">
              <PrimaryButton onClick={handleCreate} text="Create Inquiry" buttonType="button" disabled={isDisabled}/>
              {/* <Button
                variant="contained"
                style={{ backgroundColor: "#0D8FFD" }}
                className="items-center gap-2 flex flex-row justify-center text-center"
                onClick={handleCreate}
              >
                Create Inquiry
              </Button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInquiryView;
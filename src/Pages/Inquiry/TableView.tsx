import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faSortUp,
  faSortDown,
  faSort,
  faSearch,
  faFilter,
  faTimes,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { BiFilterAlt } from "react-icons/bi";
import { toast } from "react-toastify";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { useReferenceData } from "../../Service/ReferenceDataContext";
import Loader from "../../Components/Loader";
import BoardView from "./BoardView";
import { InquirySummary } from "../../Interface/InquirySummary";
import { makeRequest } from "../../Service/api";
import { INQUIRYURL } from "../../Constants/api";

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "new":
      return "bg-green-500 text-white";
    case "under review":
      return "bg-[#6FBCEC] text-white";
    case "invoiced":
      return "bg-[#269BE3] text-white";
    case "accepted":
      return "bg-[#FFD970] text-white";
    case "procurement in progress":
      return "bg-[#FFC933] text-white";
    case "goods in house (partially)":
      return "bg-[#BAE576] text-white";
    case "goods in house (fully)":
      return "bg-[#BAE576] text-white";
    case "fulfilled":
      return "bg-[#A1DB43] text-white";
    case "cancelled":
      return "bg-[#FF4949] text-white";
    case "closed":
      return "bg-[#FF4949] text-white";
    case "paid":
      return "bg-[#A1DB43] text-white";
    default:
      return "bg-gray-200";
  }
};

const InquiryTable = () => {
  const navigate = useNavigate();
  const referenceData = useReferenceData();
  const [inquiries, setInquiries] = useState<InquirySummary[]>([])
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [query, setQuery] = useState<string | null>(null);
  const [selectedStageValues, setSelectedStageValues] = useState<string[] | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc" | null;
  }>({
    key: "",
    direction: "asc",
  });
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentView, setCurrentView] = useState("table");
  const toggleView = () => {
    setCurrentView((prevView) => (prevView === "table" ? "board" : "table"));
  };
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = inquiries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(inquiries.length / itemsPerPage);

  useEffect(() => {
    fetchInquiry();
  }, [query, selectedStageValues]);

  const fetchInquiry = async (value?: string | null) => {
    setLoading(true);
    try {

      console.log(selectedStageValues)
      console.log(query)
      const responseData = await makeRequest('get',
                                             `${INQUIRYURL}/list${query != null ? `?query=${query}` : `?query=`}${selectedStageValues != null && selectedStageValues.length > 0 ? `&stage=${selectedStageValues.join(',',)}` : ''}`);
      if (responseData) {
        const inquiries: InquirySummary[] = responseData.data.map(
          (item: any) => ({
            id: item.id,
            productName: item.name,
            quantity: item.quantity,
            price: item.price,
            customizations: item.customizations,
            status: item.stage.name,
          })
        );

        setInquiries(inquiries)
      }
    } catch (error) {
      toast.error(`Something went wrong! ${error}`);
    }
    setLoading(false);
  };

  const resetInquiryFilter = (e: React.FormEvent) => {
    e.preventDefault();

    setQuery(null);
    setSelectedStageValues([]);

    // fetchInquiry()
  };

  const applyInquiryFilter = (e: React.FormEvent) => {
    e.preventDefault();

    fetchInquiry(query);
    setIsFilterOpen(false);
  };

  const handleInquiryFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    // fetchInquiry(e.target.value);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const closeFilter = () => {
    setIsFilterOpen(false);
  };

  const handleCheckboxChange = (value: string) => {
    // Toggle the value in the array
    setSelectedStageValues((prevValues) => {
      if (prevValues?.includes(value)) {
        return prevValues.filter((prevValue) => prevValue !== value);
      } else {
        return [...(prevValues || []), value];
      }
    });
  };

  // Handle page change in the CustomPagination component
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number | string) => {
    // Check if the input is a valid number greater than 0
    const newValue = typeof value === "number" && value > 0 ? value : 1;

    setItemsPerPage(newValue);
    setCurrentPage(1);
  };

  const handleSortChange = (key: string) => {
    if (sortConfig.key === key) {
      const newDirection: "asc" | "desc" | null =
        sortConfig.direction === "asc"
          ? "desc"
          : sortConfig.direction === "desc"
            ? null
            : "asc";
      setSortConfig({ key, direction: newDirection });
    } else {
      setSortConfig({ key, direction: "asc" });
    }
  };

  const handleViewInquiry = (id: string) => {
    // Implement the logic to view the inquiry
    // For example, you can navigate to a details page
    console.log(`Viewing inquiry with ID: ${id}`);
  };

  const sortedData = () => {
    const sortableData = [...currentItems];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof InquirySummary];
        const bValue = b[sortConfig.key as keyof InquirySummary];
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    } else {
      return inquiries.slice(indexOfFirstItem, indexOfLastItem);
    }
    return sortableData;
  };

  const columns = [
    {
      key: "productName",
      header: "Product Name",
      size: 200,
      sortable: true,
      headerAlign: "text-start",
    },
    {
      key: "quantity",
      header: "Quantity",
      size: 100,
      sortable: true,
      headerAlign: "justify-center",
    },
    {
      key: "price",
      header: "Price",
      size: 100,
      sortable: true,
      headerAlign: "justify-center",
    },
    {
      key: "status",
      header: "Status",
      size: 50,
      sortable: true,
      headerAlign: "justify-center",
    },
    { key: "action", header: "Action", size: 5, headerAlign: "justify-center" },
  ];

  return (
    <div className="w-full py-8 h-[90vh] overflow-x-auto">
      <div
        className=" rounded-[10px]    h-full  flex flex-col mx-1"
        style={{ boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.05)" }}
      >
        <div className="inquiry-table-header flex flex-row justify-between items-center w-full p-3 pb-6">
          <div className="heading font-bold text-2xl">Current Inquiries</div>
          <div className="search-container flex flex-row gap-4 items-center justify-center">
            <form className="search-form flex items-center overflow-hidden rounded-[5px] border border-neutral-400 border-opacity-20">
              <FontAwesomeIcon
                icon={faSearch}
                className="search-icon text-[#0D8FFD] w-4 h-4 pl-3 pr-1"
              />
              <input
                type="search"
                placeholder="Search Inquiry"
                className="search-input flex-1 p-1.5 bg-transparent outline-none  text-base"
                value={query ? query : ''}
                onChange={(e) => setQuery(e.target.value)}
                onInput={handleInquiryFilter}
              />
            </form>

            <div className="filter-section relative w-32">
              <button
                className="filter-button flex items-center justify-center p-1.5 rounded-[5px] border-2 gap-3  border-[#0D8FFD]  focus:outline-none focus:border-blue-600 w-32"
                onClick={toggleFilter}
              >
                <span className="text-[#0D8FFD] text-base font-bold">
                  Filter
                </span>
                <BiFilterAlt className="filter-icon mr-2 text-[#0D8FFD] w-4 h-4 " />
              </button>

              {isFilterOpen && (
                <div className="filter-options absolute right-0 mt-2 p-4 bg-white shadow z-50 w-96 rounded-md">
                  <div className="flex justify-between mb-4 items-center flex-row">
                    <div className="text-xl font-bold">Filter</div>
                    <FontAwesomeIcon
                      icon={faTimes}
                      className="text-red-500 cursor-pointer w-5 h-5"
                      onClick={closeFilter}
                    />
                  </div>
                  <div className="text-base font-medium pb-2">Status</div>
                  <div className="flex flex-row w-full">
                    <div className="mr-4 w-full">
                    {Object.values(referenceData?.stage || {}).map((stage) => (
                      <label className="filter-option block mb-2" key={stage.id}>
                        <input type="checkbox"
                               className="mr-2"
                               value={stage.id}
                               checked={selectedStageValues?.includes(String(stage.id))}
                               onChange={() => handleCheckboxChange(String(stage.id))}
                        />
                        {stage.name}
                      </label>
                    ))}
                    </div>
                  </div>

                  {/* Buttons for Clear Filters and Apply Filters */}
                  <div className="flex justify-end mt-4 ">
                    <button
                      className=" text-red-500 px-4 py-1 mr-2 rounded border-2 border-red-500 font-bold text-base"
                      onClick={resetInquiryFilter}
                    >
                      Reset Filters
                    </button>
                    <button
                      className="bg-blue-500 text-white px-4 py-1 rounded text-base"
                      onClick={applyInquiryFilter}
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="view-options flex items-center gap-4 pl-5 pb-2">
          <button
            className={`view-option flex flex-row items-center justify-center relative ${currentView === "table" ? "active text-sky-500 py-3" : ""
              }`}
            onClick={() => setCurrentView("table")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className={`w-6 h-6 mr-2 ${currentView === "table" ? "text-sky-500" : "text-gray-500"
                }`}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            List
            {currentView === "table" && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-sky-500"></div>
            )}
          </button>
          <button
            className={`view-option flex flex-row items-center justify-center relative ${currentView === "board" ? "active text-sky-500 py-3" : ""
              }`}
            onClick={() => setCurrentView("board")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className={`w-5 h-5 mr-2 ${currentView === "board"
                  ? "text-sky-500 transform scale-x-[-1]"
                  : "text-gray-500 transform scale-x-[-1]"
                } transform rotate-180`}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
              />
            </svg>
            Board
            {currentView === "board" && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-sky-500"></div>
            )}
          </button>
        </div>

        {currentView === "table" ? (
          <div className="px-4 pb-4 h-full overflow-y-auto">
            {loading ? (
              <Loader />
            ) : (
              <div className="container mx-auto h-full flex flex-col justify-between">
                {inquiries.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full ">
                        <thead className="sticky top-0 bg-white text-base">
                          <tr>
                            {columns.map((column, index) => (
                              <th
                                key={index}
                                className={`border-b-2 border-blue-300 border-opacity-60  p-3 cursor-pointer ${column.sortable ? "" : ""
                                  } ${column.headerAlign}`}
                                style={{ width: `${column.size}px` }}
                                onClick={() =>
                                  column.sortable && handleSortChange(column.key)
                                }
                              >
                                <div
                                  className={`flex items-center flex-row ${column.headerAlign}`}
                                >
                                  {column.header}
                                  {column.sortable && (
                                    <span className="ml-2 ">
                                      {sortConfig.key === column.key ? (
                                        sortConfig.direction === "asc" ? (
                                          <div className="flex flex-col">
                                            <IoIosArrowUp
                                              className=" text-gray-300"
                                              style={{ marginBottom: "-3.5px" }}
                                            />
                                            <IoIosArrowDown
                                              className="text-blue-500"
                                              style={{ marginTop: "-3.5px" }}
                                            />
                                          </div>
                                        ) : sortConfig.direction === "desc" ? (
                                          <div className="flex flex-col">
                                            <IoIosArrowUp
                                              className="text-blue-500"
                                              style={{ marginBottom: "-3.5px" }}
                                            />
                                            <IoIosArrowDown
                                              className="text-gray-300"
                                              style={{ marginTop: "-3.5px" }}
                                            />
                                          </div>
                                        ) : (
                                          <div className="flex flex-col">
                                            <IoIosArrowUp
                                              className="text-blue-500"
                                              style={{ marginBottom: "-3.5px" }}
                                            />
                                            <IoIosArrowDown
                                              className="text-blue-500"
                                              style={{ marginTop: "-3.5px" }}
                                            />
                                          </div>
                                        )
                                      ) : (
                                        <div className="flex flex-col">
                                          <IoIosArrowUp
                                            className="text-blue-500"
                                            style={{ marginBottom: "-3.5px" }}
                                          />
                                          <IoIosArrowDown
                                            className="text-blue-500"
                                            style={{ marginTop: "-3.5px" }}
                                          />
                                        </div>
                                      )}
                                    </span>
                                  )}
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          {sortedData().map((row, index) => (
                            <tr key={index}>
                              <td className="border-b border-[#f6f6f6] p-3">
                                {row.productName}
                              </td>
                              <td className="border-b border-[#f6f6f6] p-3 text-center">
                                {row.quantity.toLocaleString("en-US")}
                              </td>
                              <td className="border-b border-[#f6f6f6] p-3 text-center">
                                €
                                {row.price.toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </td>
                              <td className="border-b border-[#f6f6f6] p-3 text-center">
                                <div
                                  className={`inline-block px-2 pb-1 rounded ${getStatusColor(
                                    row.status
                                  )}`}
                                  style={{ maxWidth: "fit-content" }}
                                >
                                  {row.status}
                                </div>
                              </td>

                              <td className="border-b border-[#f6f6f6] p-3 text-center">
                                <Link to={`/inquiry/${row.id}`} className="text-blue-500">
                                  <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div
                      className="flex items-center mt-4 p-4 rounded"
                      style={{ boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.05)" }}
                    >
                      <label htmlFor="itemsPerPage" className="mr-4 text-sm">
                        Per page:
                      </label>
                      <input
                        id="itemsPerPage"
                        value={itemsPerPage}
                        onChange={(e) =>
                          handleItemsPerPageChange(Number(e.target.value))
                        }
                        className=" border rounded w-16 text-center text-sm text-gray-500"
                        inputMode="numeric"
                      />

                      <Stack spacing={2} className="ml-auto">
                        <Pagination
                          count={totalPages}
                          page={currentPage}
                          shape="rounded"
                          color="primary"
                          onChange={(event, page) => handlePageChange(page)}
                          renderItem={(item) => (
                            <PaginationItem
                              slots={{
                                previous: ArrowBackIcon,
                                next: ArrowForwardIcon,
                              }}
                              {...item}
                            />
                          )}
                        />
                      </Stack>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="rounded-[10px] h-full flex items-center justify-center">
                      <h2 className="text-4xl dark:text-gray-600">You have no inquiries</h2>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="px-4 pb-4 h-full w-full overflow-y-auto overflow-x-auto">
            {/* Render BoardView component */}
            <BoardView data={inquiries} onViewInquiry={handleViewInquiry} />
          </div>
        )}
      </div>
    </div>
  );
};

export default InquiryTable;
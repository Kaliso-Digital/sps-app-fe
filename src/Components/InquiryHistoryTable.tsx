import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import data, { InquiryHistory } from "../MockData/InquiryHistoryMockData";
import FilterButton from "./FilterButton";
import { BiFilterAlt } from "react-icons/bi";

import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { stageData } from "../DropDownData/DropDownData";

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "new":
      return "bg-green-500 text-white";
    case "processing":
      return "bg-yellow-500 text-black";
    case "completed":
      return "bg-blue-500 text-white";
    case "pending":
      return "bg-orange-500 text-white";
    default:
      return "bg-gray-200";
  }
};

const InquiryHistoryTable = () => {
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc" | null;
  }>({
    key: "",
    direction: "asc",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  const closeFilter = () => {
    setIsFilterOpen(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // const totalPages = Math.ceil(data.length / itemsPerPage);

  // const handlePageChange = (newPage: number) => {
  //   setCurrentPage(newPage);
  // };

  const totalPages = Math.ceil(data.length / itemsPerPage);

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

  const sortedData = () => {
    const sortableData = [...currentItems];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof InquiryHistory];
        const bValue = b[sortConfig.key as keyof InquiryHistory];
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    } else {
      return data.slice(indexOfFirstItem, indexOfLastItem);
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
      key: "customizations",
      header: "Customizations",
      size: 3,
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
          <div className="heading font-bold text-2xl">Inquiry History</div>
          <div className="search-container flex flex-row gap-4 items-center justify-center">
            <form className="search-form flex items-center overflow-hidden rounded-[5px] border border-neutral-400 border-opacity-20">
              <FontAwesomeIcon
                icon={faSearch}
                className="search-icon text-[#0D8FFD] w-4 h-4 pl-3 pr-1"
              />
              <input
                type="search"
                placeholder="Search Inquiries"
                className="search-input flex-1 p-1.5 bg-transparent outline-none  text-base"
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
                    {/* First column of filter options */}
                    <div className="mr-4 w-1/2">
                      <label className="filter-option block mb-2">
                        <input type="checkbox" className="mr-2" />
                        New
                      </label>
                      <label className="filter-option block mb-2">
                        <input type="checkbox" className="mr-2" />
                        Completed
                      </label>

                      {/* Add more checkboxes as needed */}
                    </div>

                    {/* Second column of filter options */}
                    <div>
                      <label className="filter-option block mb-2">
                        <input type="checkbox" className="mr-2" />
                        Processing
                      </label>
                      <label className="filter-option block mb-2 ">
                        <input
                          type="checkbox"
                          className="mr-2"
                          style={{ border: "2px solid #bcbcbc" }}
                        />
                        Pending
                      </label>
                      {/* Add more checkboxes as needed */}
                    </div>
                  </div>

                  {/* Buttons for Clear Filters and Apply Filters */}
                  <div className="flex justify-end mt-4 ">
                    <button
                      className=" text-red-500 px-4 py-1 mr-2 rounded border-2 border-red-500 font-bold text-base"
                      onClick={() => {
                        // Add logic to clear filters
                      }}
                    >
                      Reset Filters
                    </button>
                    <button
                      className="bg-blue-500 text-white px-4 py-1 rounded text-base"
                      onClick={() => {
                        // Add logic to apply filters
                      }}
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-4 pb-4 h-full overflow-y-auto">
          <div className="container mx-auto h-full flex flex-col justify-between">
            <div className="overflow-x-auto">
              <table className="min-w-full ">
                <thead className="sticky top-0 bg-white text-base">
                  <tr>
                    {columns.map((column, index) => (
                      <th
                        key={index}
                        className={`border-b-2 border-blue-300 border-opacity-60  p-2 cursor-pointer ${
                          column.sortable ? "" : ""
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
                      <td className="border-b border-[#f6f6f6] p-2">
                        {row.productName}
                      </td>
                      <td className="border-b border-[#f6f6f6] p-2 text-center">
                        {row.quantity.toLocaleString("en-US")}
                      </td>
                      <td className="border-b border-[#f6f6f6] p-2 text-center">
                        $
                        {row.price.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="border-b border-[#f6f6f6] p-2 text-center ">
                        {row.customizations ? "Yes" : "No"}
                      </td>
                      <td className="border-b border-[#f6f6f6] p-2 text-center">
                        <div
                          className={`inline-block px-2 pb-1 rounded ${getStatusColor(
                            row.status
                          )}`}
                          style={{ maxWidth: "fit-content" }}
                        >
                          {row.status}
                        </div>
                      </td>

                      <td className="border-b border-[#f6f6f6] p-2 text-center">
                        <Link
                          to={`.${row.action}`}
                          className="text-blue-500"
                        >
                          <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div
              className="flex items-center mt-4 p-2 rounded"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default InquiryHistoryTable;

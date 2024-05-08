import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faSortUp,
  faSortDown,
  faSort,
  faSearch,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { BiFilterAlt } from "react-icons/bi";

import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Loader from "./Loader";
import { InquiryPayment } from "../MockData/InquiryPaymentMockData";
import { makeRequest } from "../Service/api";
import { INQUIRYURL } from "../Constants/api";
import { toast } from "react-toastify";
import { useReferenceData } from "../Service/ReferenceDataContext";

const InquiryPaymentTable = () => {
  const navigate = useNavigate();
  const referenceData = useReferenceData();
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState<InquiryPayment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [query, setQuery] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc" | null;
  }>({
    key: "",
    direction: "asc",
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = payments.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(payments.length / itemsPerPage);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async (value?: string | null) => {
    setLoading(true);
    try {
      const responseData = await makeRequest('get',
                                             `${INQUIRYURL}/payment/list${value != null ? `?query=${value}` : `?query=`}`)
      if (responseData) {
        setPayments(responseData.data)
      }
    } catch (error) {
      toast.error(`Something went wrong! ${error}`);
    }
    setLoading(false);
  }

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
        const aValue = a[sortConfig.key as keyof InquiryPayment] || '';
        const bValue = b[sortConfig.key as keyof InquiryPayment] || '';
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    } else {
      return payments.slice(indexOfFirstItem, indexOfLastItem);
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
    { key: "quantity", header: "Quantity", size: 100, sortable: true },
    { key: "price", header: "Price", size: 100, sortable: true },
    { key: "customizations", header: "Customizations", size: 3 }
  ];



  return (
    <div className="w-full py-8 h-[90vh] overflow-x-auto">
      
      <div className=" rounded-[10px]  h-full  flex flex-col mx-1" style={{ boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.05)' }}>
        <div className="inquiry-table-header flex flex-row justify-between items-center w-full p-3 pb-6">
          <div className="heading font-bold text-2xl">Inquiry Payment</div>
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

            
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : (
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
                            column.sortable ? "hover:bg-gray-200" : ""
                          } ${column.headerAlign}`}
                          style={{ width: `${column.size}px` }}
                          onClick={() =>
                            column.sortable && handleSortChange(column.key)
                          }
                        >
                          {column.header}
                          {column.sortable && (
                            <span className="ml-2 ">
                              {sortConfig.key === column.key ? (
                                sortConfig.direction === "asc" ? (
                                  <FontAwesomeIcon
                                    icon={faSortUp}
                                    className="text-blue-500"
                                  />
                                ) : sortConfig.direction === "desc" ? (
                                  <FontAwesomeIcon
                                    icon={faSortDown}
                                    className="text-blue-500"
                                  />
                                ) : (
                                  <FontAwesomeIcon
                                    icon={faSort}
                                    className="text-gray-500"
                                  />
                                )
                              ) : (
                                <FontAwesomeIcon
                                  icon={faSort}
                                  className="text-gray-500"
                                />
                              )}
                            </span>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {sortedData().map((row, index) => (
                      <tr key={index}>
                        <td className="border-b border-[#f6f6f6] p-2">{row.name}</td>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center mt-4 p-2 rounded" style={{ boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.05)' }}>
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
        )}
      </div>
    </div>
  );
};

export default InquiryPaymentTable;

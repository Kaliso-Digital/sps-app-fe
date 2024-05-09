import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faSortUp,
  faSortDown,
  faSort,
  faSearch,
  faTimes,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { BiFilterAlt } from "react-icons/bi";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { makeRequest } from "../../Service/api";
import AddUserPopup from "../../Components/AddUserPopup";
import ResetUserPasswordPopup from "../../Components/ResetUserPasswordPopup";
import User from "../../Interface/User";
import { roleData } from "../../DropDownData/DropDownData";
import { USERURL } from "../../Constants/api";
import Loader from "../../Components/Loader";

const UsersTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc" | null;
  }>({
    key: "",
    direction: "asc",
  });
  const [query, setQuery] = useState<string | null>(null);
  const [role, setRole] = useState<number | null>(null);
  const [userId, setUserId] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddUserPopupOpen, setAddUserPopupOpen] = useState(false);
  const [isResetUserPasswordPopupOpen, setIsResetUserPasswordPopupOpen] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
				const responseData = await makeRequest('get',
																							 `${USERURL}/list`)

        if (responseData) {
          setUsers(responseData.data)
        }
      } catch (error) {
        toast.error(`Something went wrong! ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [role]);

  const fetchUsers = async (value?: string | null) => {
    try {
      setLoading(true);
			const responseData = await makeRequest('get',
                                             `${USERURL}/list${value != null ? `?query=${value}` : '?query='}${role !== null ? `&role=${role}` : ''}`);

      if (responseData) {
        setUsers(responseData.data)
      }
    } catch (error) {
      toast.error(`Something went wrong! ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const resetUserFilter = async (e: React.FormEvent) => {
    e.preventDefault();

    setQuery(prevQuery => null);
    setRole(prevRole => null);

    // await fetchUsers();
  };

	const applyUserFilter = async (e: React.FormEvent) => {
		e.preventDefault();

		await fetchUsers(query);
    setIsFilterOpen(false);
	}

  const handleUserFilter = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    await fetchUsers(e.target.value);
  };

  const openAddUserPopup = () => {
    setAddUserPopupOpen(true);
  };

  const closeAddUserPopup = () => {
    fetchUsers();
    setAddUserPopupOpen(false);
  };

  const openResetUserPasswordPopup = (userId : number) => {
    console.log('User ID');
    console.log(userId);
    setUserId(userId);
    setIsResetUserPasswordPopupOpen(true);
  }

  const closeResetUserPasswordPopup = () => {
    setUserId(0);
    setIsResetUserPasswordPopupOpen(false);
  }

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  const closeFilter = () => {
    setIsFilterOpen(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

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
        const aValue = a[sortConfig.key as keyof User];
        const bValue = b[sortConfig.key as keyof User];
        if ((aValue ?? 0) < (bValue ?? 0)) return sortConfig.direction === "asc" ? -1 : 1;
        if ((aValue ?? 0) > (bValue ?? 0)) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    } else {
      return users.slice(indexOfFirstItem, indexOfLastItem);
    }
    return sortableData;
  };

  const columns = [
    {
      key: "firstName",
      header: "Name",
      size: 100,
      headerAlign: "text-start",
    },
    { key: "email", header: "Email Address", size: 100 },
    { key: "phone", header: "Phone Number", size: 100 },
    { key: "role.name", header: "Type", size: 20, sortable: true },
    { key: "id", header: "Action", size: 5 },
  ];

  const deleteUser = async (userId: number) => {
    try {
      const responseData = await makeRequest('delete',
																							`${USERURL}/${userId}`);

      if (responseData) {
        fetchUsers();
      }
    } catch (error) {
      toast.error(`Something went wrong! ${error}`);
    }
  };

  const handleDeleteClick = (userId: number) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (shouldDelete) {
      deleteUser(userId);
    }
  };

  return (
    <div className="w-full py-8 h-[90vh] overflow-x-auto">
      <div className=" rounded-[10px] shadow h-full  flex flex-col">
        <div className="inquiry-table-header flex flex-row justify-between items-center w-full p-3 pb-6">
          <div className="heading font-bold text-2xl">Users</div>
          <div className="search-container flex flex-row gap-4 items-center justify-center">
            <form className="search-form flex items-center overflow-hidden rounded-[5px] border border-neutral-400 border-opacity-20">
              <FontAwesomeIcon
                icon={faSearch}
                className="search-icon text-[#0D8FFD] w-4 h-4 pl-3 pr-1"
              />
              <input
                type="search"
                placeholder="Search"
                className="search-input flex-1 p-1.5 bg-transparent outline-none  text-base"
                value={query ? query : ''}
                onChange={(e) => setQuery(e.target.value)}
                onInput={handleUserFilter}
              />
            </form>

            <div className="filter-section relative w-32">
              <button
                className="filter-button flex items-center justify-center p-1.5 rounded-[5px] border-2 gap-3  border-[#0D8FFD] focus:outline-none focus:border-blue-600 w-32"
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

                  {/* Dropdown for the first column of filter options */}
                  <div className=" ">
                    <label
                      htmlFor="filterOptions1"
                      className="block mb-2 text-base font-medium pb-2"
                    >
                      User Type
                    </label>
                    <select
                      id="filterOptions1"
                      className="w-full p-2 border border-gray-300 rounded text-gray-500"
                      value={role ? role : ''}
                      onChange={(e) => setRole(e.target.value ? parseInt(e.target.value) : null)}
                    >
                      <option></option>
                      {roleData.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                      ))}
                    </select>
                  </div>

                  {/* Buttons for Clear Filters and Apply Filters */}
                  <div className="flex justify-end mt-4 ">
                    <button
                      className=" text-red-500 px-4 py-1 mr-2 rounded border-2 border-red-500 font-bold text-base hover:bg-red-500 hover:text-white"
                      onClick={resetUserFilter}
                    >
                      Reset Filters
                    </button>
                    <button
                      className="bg-blue-500 text-white px-4 py-1 rounded text-base"
                      onClick={applyUserFilter}
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={openAddUserPopup}
              className="filter-button flex items-center justify-center p-1.5 rounded-[5px] border-2 gap-3  bg-[#0D8FFD] hover:bg-blue-600 w-44 outline-none hover:outline-none border-[#0D8FFD]"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2 text-white" />
              <span className="text-white text-base font-bold">
                Add New User
              </span>
            </button>
          </div>
        </div>

        <div className="px-4 pb-4 h-full overflow-y-auto">
            {loading ? (
              <Loader />
            ) :
            (
              <div className="container h-full mx-auto flex flex-col justify-between">
                {sortedData().length > 0 ?
                (<div className="overflow-x-auto">
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
                        {sortedData().map((row: User, index) => (
                        <tr key={index}>
                          <td className="border-b border-[#f6f6f6]">
                            {`${row.firstName} ${row.lastName}`}
                          </td>
                          <td className="border-b border-[#f6f6f6] p-4 text-center">
                            {row.email}
                          </td>
                          <td className="border-b border-[#f6f6f6] p-4 text-center">
                            {row.phone}
                          </td>
                          <td className="border-b border-[#f6f6f6] p-4 text-center">
                            {row.role.name}
                          </td>
                          <td className="border-b border-[#f6f6f6] p-4 text-center">
                            <div className="flex">
                              <div className="flex-1">
                                <button
                                className="w-full items-center justify-center flex"
                                onClick={() => handleDeleteClick(row.id)}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="red"
                                    className="w-5 h-5"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                    />
                                  </svg>
                                </button>
                              </div>

                              <div className="flex-1">
                                <button
                                className="w-full items-center justify-center flex"
                                onClick={() => openResetUserPasswordPopup(row.id)}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1"
                                    stroke="blue"
                                    className="w-5 h-5">
                                    <path
                                      fill="currentColor"
                                      d="M6 12a1 1 0 11-2 0 1 1 0 012 0zM9 13a1 1 0 100-2 1 1 0 000 2zM14 12a1 1 0 11-2 0 1 1 0 012 0zM20 11h-4v2h4v-2z"
                                    />
                                    <path
                                      fill="currentColor"
                                      fillRule="evenodd"
                                      d="M2 6a2 2 0 00-2 2v8a2 2 0 002 2h20a2 2 0 002-2V8a2 2 0 00-2-2H2zm20 2H2v8h20V8z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>) : (
                  <div className="rounded-[10px] shadow h-full flex items-center justify-center">
                    <div className="heading text-slate-500 font-bold text-2xl">No Users Found</div>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center mt-4">
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
      {isAddUserPopupOpen && (
        <div className="overlay">
          <AddUserPopup onClose={closeAddUserPopup} />
        </div>
      )}
      {isResetUserPasswordPopupOpen && (
        <div className="overlay">
          <ResetUserPasswordPopup user={userId} onClose={closeResetUserPasswordPopup} />
        </div>
      )}
    </div>
  );
};

export default UsersTable;

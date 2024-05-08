import React from "react";
import { NavLink } from "react-router-dom";
import { useSignOut } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "../Service/PermissionsContext";
import { hasPermission } from "../Service/utils";
import { PERM_INQUIRY_CREATE, PERM_INQUIRY_VIEW, PERM_PAYMENT_VIEW, PERM_USER_VIEW } from "../Constants/permission";

function SideNav() {
// export const SideNav = () => {
  const signOut = useSignOut();
  const navigate = useNavigate();
  const { userPermissions, clearPermissions } = usePermissions();

  const logOut = () => {
    clearPermissions();
    signOut();
    navigate("/");
  };

  return (
    <nav className="w-[14rem] md:w-[16rem] lg:w-[18rem] flex-shrink-0 items-center justify-center flex h-[90vh] py-8 ">
      <div className=" w-full h-full flex-shrink-0 flex flex-col justify-between bg-[#091A30] rounded-[10px]  border border-sky-500 border-opacity-20 py-5 overflow-y-auto">
        <div>
          {hasPermission(userPermissions, PERM_INQUIRY_CREATE) && (
            <NavLink
              to="create-inquiry"
              className="create-inquiry-section flex flex-row flex-shrink-0 bg-white text-black py-1.5 gap-4 items-center justify-center rounded-[5px] mx-5"
            >
              <div className="image h-5 w-5 items-center flex justify-center">
                <img src="/Assets/sideNavIcons/Icon (Stroke) (10).png" alt="" />
              </div>

              <div className="text text-black font-medium text-sm md:text-base lg:text-lg">
                Create Inquiry
              </div>
            </NavLink>
          )}

          <div className="nav-items-section flex flex-col gap-4 pt-10 flex-shrink-0">
            {hasPermission(userPermissions, PERM_INQUIRY_VIEW) && (
            <NavLink
              to="inquiries"
              className={({ isActive }) =>
                isActive
                  ? "nav-item flex flex-row items-center justify-start gap-6 hover:bg-slate-800 rounded-[5px] text-white py-2"
                  : "nav-item flex flex-row items-center justify-start gap-6 hover:bg-slate-800 rounded-[5px] text-[#8A8B96] py-2"
              }
              children={({ isActive }) => (
                <div className="flex h-full w-full justify-between">
                  <div className="flex flex-row justify-start items-center">
                    <div
                      className={
                        isActive
                          ? "sidebox w-2 h-full bg-white"
                          : "sidebox w-2"
                      }
                    />
                    <div className="flex items-center justify-center gap-4">
                      <div className="image h-5 w-5 items-center flex justify-center ml-10">
                        {isActive ? (
                          <img
                            src="/Assets/sideNavIconsActive/Icon (Stroke).png"
                            alt=""
                          />
                        ) : (
                          <img
                            src="/Assets/sideNavIcons/Icon (Stroke) (1).png"
                            alt=""
                          />
                        )}
                      </div>
                      <div className="font-medium text-sm md:text-base lg:text-lg">
                        Inquiry Status
                      </div>
                    </div>
                  </div>

                  <div
                    className={
                      isActive ? "sidebox w-2 bg-white" : "sidebox w-2"
                    }
                  />
                </div>
              )}
            />
            )}

            {/* {hasPermission(userPermissions, PERM_INQUIRY_VIEW) && (
            <NavLink
              to="inquiryHistory"
              className={({ isActive }) =>
                isActive
                  ? "nav-item flex flex-row items-center justify-start gap-6 hover:bg-slate-800 rounded-[5px] text-white"
                  : "nav-item flex flex-row items-center justify-start gap-6 hover:bg-slate-800 rounded-[5px] text-[#8A8B96]"
              }
              children={({ isActive }) => (
                <div className="flex h-full w-full justify-between">
                  <div className="flex flex-row justify-start items-center">
                    <div
                      className={
                        isActive
                          ? "sidebox w-2 h-full bg-white"
                          : "sidebox w-2"
                      }
                    />
                    <div className="flex items-center justify-center gap-4">
                      <div className="image h-5 w-5 items-center flex justify-center ml-10">
                        {isActive ? (
                          <img
                            src="/Assets/sideNavIconsActive/Icon (Stroke)-1.png"
                            alt=""
                          />
                        ) : (
                          <img
                            src="/Assets/sideNavIcons/Icon (Stroke) (2).png"
                            alt=""
                          />
                        )}
                      </div>
                      <div className="font-medium text-sm md:text-base lg:text-lg">
                        Inquiry History
                      </div>
                    </div>
                  </div>

                  <div
                    className={
                      isActive ? "sidebox w-2 bg-white" : "sidebox w-2"
                    }
                  />
                </div>
              )}
            />
            )} */}

            {hasPermission(userPermissions, PERM_PAYMENT_VIEW) && (
            <NavLink
              to="payments"
              className={({ isActive }) =>
                isActive
                  ? "nav-item flex flex-row items-center justify-start gap-6 hover:bg-slate-800 rounded-[5px] text-white py-2"
                  : "nav-item flex flex-row items-center justify-start gap-6 hover:bg-slate-800 rounded-[5px] text-[#8A8B96] py-2"
              }
              children={({ isActive }) => (
                <div className="flex h-full w-full justify-between">
                  <div className="flex flex-row justify-start items-center">
                    <div
                      className={
                        isActive
                          ? "sidebox w-2 h-full bg-white"
                          : "sidebox w-2"
                      }
                    />
                    <div className="flex items-center justify-center gap-4 ">
                      <div className="image h-5 w-5 items-center flex justify-center ml-10">
                        {isActive ? (
                          <img
                            src="/Assets/sideNavIconsActive/Icon (Stroke)-2.png"
                            alt=""
                          />
                        ) : (
                          <img
                            src="/Assets/sideNavIcons/Icon (Stroke) (3).png"
                            alt=""
                          />
                        )}
                      </div>
                      <div className="font-medium text-sm md:text-base lg:text-lg">
                        Inquiry Payment
                      </div>
                    </div>
                  </div>

                  <div
                    className={
                      isActive ? "sidebox w-2 bg-white" : "sidebox w-2"
                    }
                  />
                </div>
              )}
            />
            )}

            {hasPermission(userPermissions, PERM_USER_VIEW) && (
            <NavLink
              to="users"
              className={({ isActive }) =>
                isActive
                  ? "nav-item flex flex-row items-center justify-start gap-6 hover:bg-slate-800 rounded-[5px] text-white py-2"
                  : "nav-item flex flex-row items-center justify-start gap-6 hover:bg-slate-800 rounded-[5px] text-[#8A8B96] py-2"
              }
              children={({ isActive }) => (
                <div className="flex h-full w-full justify-between">
                  <div className="flex flex-row justify-start items-center">
                    <div
                      className={
                        isActive
                          ? "sidebox w-2 h-full bg-white"
                          : "sidebox w-2"
                      }
                    />
                    <div className="flex items-center justify-center gap-4">
                      <div className="image h-5 w-5 items-center flex justify-center ml-10">
                        {isActive ? (
                          <img
                            src="/Assets/sideNavIconsActive/Icon (Stroke)-3.png"
                            alt=""
                          />
                        ) : (
                          <img
                            src="/Assets/sideNavIcons/Icon (Stroke) (4).png"
                            alt=""
                          />
                        )}
                      </div>
                      <div className="font-medium text-sm md:text-base lg:text-lg">
                        Users
                      </div>
                    </div>
                  </div>

                  <div
                    className={
                      isActive ? "sidebox w-2 bg-white" : "sidebox w-2"
                    }
                  />
                </div>
              )}
            />
            )}

            <NavLink
              to="profile"
              className={({ isActive }) =>
                isActive
                  ? "nav-item flex flex-row items-center justify-start gap-6 hover:bg-slate-800 rounded-[5px] text-white py-2"
                  : "nav-item flex flex-row items-center justify-start gap-6 hover:bg-slate-800 rounded-[5px] text-[#8A8B96] py-2"
              }
              children={({ isActive }) => (
                <div className="flex h-full w-full justify-between">
                  <div className="flex flex-row justify-start items-center">
                    <div
                      className={
                        isActive
                          ? "sidebox w-2 h-full bg-white"
                          : "sidebox w-2"
                      }
                    />
                    <div className="flex items-center justify-center gap-4">
                      <div className="image h-5 w-5 items-center flex justify-center ml-10">
                        {isActive ? (
                          <img
                            src="/Assets/sideNavIconsActive/Icon (Stroke) (11).png"
                            alt=""
                          />
                        ) : (
                          <img
                            src="/Assets/sideNavIcons/Icon (Stroke) (6).png"
                            alt=""
                          />
                        )}
                      </div>
                      <div className="font-medium text-sm md:text-base lg:text-lg">
                        Profile
                      </div>
                    </div>
                  </div>

                  <div
                    className={
                      isActive ? "sidebox w-2 bg-white" : "sidebox w-2"
                    }
                  />
                </div>
              )}
            />            
          </div>
        </div>
        <div className="logout-section flex flex-row items-center justify-start pl-8 gap-6 hover:bg-slate-800 py-2 rounded-[5px] cursor-pointer" onClick={() => logOut()}>
          <div className="image h-5 w-5 items-center flex justify-center">
            <img src="/Assets/sideNavIcons/Icon (Stroke) (8).png" alt="" />
          </div>
          <div className="text text-[#FF4949] font-medium text-sm md:text-base lg:text-lg">
            Logout
          </div>
        </div>
      </div>
    </nav>
  );
}

export default SideNav;

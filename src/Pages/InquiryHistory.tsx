import React, { useEffect } from "react";
import InquiryHistoryTable from "../Components/InquiryHistoryTable";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "../Service/PermissionsContext";
import { PERM_INQUIRY_VIEW } from "../Constants/permission";

const InquiryHistory = () => {
  const navigate = useNavigate();
  const { userPermissions } = usePermissions();

  useEffect(() => {
    if (!userPermissions.some(permission => permission.name === PERM_INQUIRY_VIEW)) {
      // Redirect to a different page if the user doesn't have permission
      navigate('/inquiryStatus');
    }
  }, [userPermissions, navigate]);

  return (
    <>
      <InquiryHistoryTable />
    </>
  );
}

export default InquiryHistory;

import React, { useEffect } from "react";
import InquiryPaymentTable from "../Components/InquiryPaymentTable";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "../Service/PermissionsContext";
import { PERM_INQUIRY_VIEW } from "../Constants/permission";

const InquiryPayment = () => {
  const navigate = useNavigate();
  const { userPermissions } = usePermissions();

  useEffect(() => {
    if (!userPermissions.some(permission => permission.name === PERM_INQUIRY_VIEW)) {
      // Redirect to a different page if the user doesn't have permission
      navigate('/inquiries');
    }
  }, [userPermissions, navigate])
  return (
    <>
      <InquiryPaymentTable />
    </>
  );
}

export default InquiryPayment;

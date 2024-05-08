import React, { useEffect } from "react";
import InquiryTable from "./TableView";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "../../Service/PermissionsContext";
import { ReferenceDataProvider } from "../../Service/ReferenceDataContext";
import { PERM_INQUIRY_VIEW } from "../../Constants/permission";

const ViewInquiries = () => {
  const navigate = useNavigate();
  const { userPermissions } = usePermissions();

  useEffect(() => {
    if (!userPermissions.some(permission => permission.name === PERM_INQUIRY_VIEW)) {
      // Redirect to a different page if the user doesn't have permission
      navigate('/inquiries');
    }
  }, [userPermissions, navigate]);

  return (
    <>
      <ReferenceDataProvider>
        <InquiryTable/>
      </ReferenceDataProvider>
    </>
  );
}

export default ViewInquiries;
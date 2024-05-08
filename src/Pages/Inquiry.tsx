import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Box, Button, Typography } from "@mui/material";
import { usePermissions } from "../Service/PermissionsContext";
import { PERM_INQUIRY_VIEW } from "../Constants/permission";

interface InquiryData {
  id: string;
  title: string;
  description: string;
}

const Inquiry = () => {
  const navigate = useNavigate();
  const { userPermissions } = usePermissions();
  const { id } = useParams();
  const [inquiryData, setInquiryData] = useState<InquiryData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Partial<InquiryData>>({});

  useEffect(() => {
    if (!userPermissions.some(permission => permission.name === PERM_INQUIRY_VIEW)) {
      navigate('/inquiries');
    }

    // Fetch inquiry details based on the ID
    // Example: const fetchData = async () => { /* fetch data based on id */ };
    // fetchData();

    // For demonstration purposes, use a mock data structure
    setInquiryData({ id: id || "", title: "Inquiry Title", description: "Inquiry Description" });
  }, [userPermissions, id, navigate]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData({ ...inquiryData });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    // Perform save logic (update the database, send API request, etc.)
    // Example: const saveData = async () => { /* save editedData */ };
    // saveData();

    // For demonstration purposes, update the local state
    setInquiryData({ ...editedData } as InquiryData);
    setIsEditing(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    setEditedData({
      ...editedData,
      [field]: e.target.value,
    });
  };

  return (
    <div>
      <Typography variant="h4">Inquiry Details</Typography>

      <Button component={Link} to={`/inquiryhistory`} variant="outlined">
        Back to Inquiry History
      </Button>

      {isEditing ? (
        <>
          <label>
            Title:
            <input
              type="text"
              value={editedData.title}
              onChange={(e) => handleInputChange(e, "title")}
            />
          </label>
          <label>
            Description:
            <textarea
              value={editedData.description}
              onChange={(e) => handleInputChange(e, "description")}
            />
          </label>
          <Button onClick={handleSave} variant="contained" color="primary">
            <FontAwesomeIcon icon={faSave} />
            Save Changes
          </Button>
          <Button onClick={handleCancelEdit} variant="outlined" color="secondary">
            <FontAwesomeIcon icon={faTimes} />
            Cancel
          </Button>
        </>
      ) : (
        <>
          <Typography variant="h5">{inquiryData?.title}</Typography>
          <Typography>{inquiryData?.description}</Typography>
          <Button onClick={handleEdit} variant="outlined" color="primary">
            <FontAwesomeIcon icon={faEdit} />
            Edit Inquiry
          </Button>
        </>
      )}
    </div>
  );
};

export default Inquiry;

import { useNavigate } from "react-router-dom"
import { useIsAuthenticated } from "react-auth-kit";
import { usePermissions } from "../../Service/PermissionsContext";
import { useEffect } from "react";
import { PERM_USER_VIEW } from "../../Constants/permission";
import { ReferenceDataProvider } from "../../Service/ReferenceDataContext";
import UsersTable from "./TableView";

const ViewUsers = () => {
    const navigate = useNavigate();
    const {userPermissions } = usePermissions();
    const isAuthenticated = useIsAuthenticated();
    if (!isAuthenticated()) {
        // Redirect to Login
        navigate('/');
    }

    useEffect(() => {
        if (!userPermissions.some(permission => permission.name === PERM_USER_VIEW)) {
            navigate('/inquiries');
        }
    }, [userPermissions, navigate]);

    return (
        <>
            <ReferenceDataProvider>
                <UsersTable />
            </ReferenceDataProvider>
        </>
    )
}

export default ViewUsers;
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../../hook/useAuth";

const RequireAuth = () => {
  const { auth } = useAuth();
  return auth.accessToken !== null &&
    auth.accessToken !== undefined &&
    auth.accessToken !== "" ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};

export default RequireAuth;

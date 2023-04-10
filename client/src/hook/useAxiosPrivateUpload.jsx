import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosPrivateUpload } from "../api/axios";
import useAuth from "./useAuth";
import useRefreshToken from "./useRefreshToken";

const useAxiosPrivateUpload = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const requestIntercept = axiosPrivateUpload.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivateUpload.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivateUpload(prevRequest);
        }

        return Promise.reject(error).then(
          error?.response?.status === 401 && navigate("/login")
        );
      }
    );

    return () => {
      axiosPrivateUpload.interceptors.request.eject(requestIntercept);
      axiosPrivateUpload.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return axiosPrivateUpload;
};

export default useAxiosPrivateUpload;

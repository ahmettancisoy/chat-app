import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefresh = () => {
  const { setAuth } = useAuth();
  const refresh = async () => {
    const response = await axios.get("/refresh", {
      withCredentials: true,
    });

    setAuth(response.data);
    console.log(response.data);
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefresh;

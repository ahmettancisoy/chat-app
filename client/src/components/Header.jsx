import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hook/useAuth";

const Header = ({ setOpen, profilePic, userName }) => {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/logout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (response.status === 204) {
        console.log("JWT token not found");
        setAuth({});
        return navigate("/login");
      }

      const msg = await response.json();
      console.log(msg);
      setAuth({});
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="sticky top-0 p-4 flex flex-row shadow h-[8%] min-h-[3rem]">
      <div className="w-1/2 flex flex-row items-center">
        <img src="/images/chat-64.png" className="h-10" alt="logo" />
        <div className="pl-4 font-bold text-xl text-blue-900">Chat App</div>
      </div>
      <div className="w-1/2 flex flex-row-reverse px-8 items-center">
        <Link className="w-10" onClick={handleLogout}>
          <img src="/images/power.png" alt="logout" />
        </Link>
        <Link
          className="rounded-full w-10 h-10 overflow-hidden ring-1 ring-gray-200 mr-6 flex justify-center items-center"
          onClick={() => setOpen(true)}
        >
          <img
            src={
              profilePic
                ? `${process.env.REACT_APP_SERVER_URL}/images/profiles/${profilePic}`
                : "/images/no-profile-picture.svg"
            }
            alt="profile"
          />
        </Link>
        <div className="text-sm mr-6">
          {userName ? userName : auth.currentUser}
        </div>
      </div>
    </div>
  );
};

export default Header;

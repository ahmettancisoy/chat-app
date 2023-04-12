import React from "react";
import useAuth from "../../hook/useAuth";

const Message = ({
  sender,
  message,
  time,
  isGroup,
  userName,
  showProfilePic,
  pic,
}) => {
  const { auth } = useAuth();
  const isMy = sender === auth.currentUser ? true : false;

  return (
    <div
      className={`flex mr-4 ${
        isMy ? "place-self-end text-right" : "place-self-start"
      }`}
    >
      {isGroup && !isMy && (
        <div className="w-8 h-8 flex justify-center items-center overflow-hidden mr-3 ml-1 rounded-full">
          <img
            src={
              showProfilePic && isGroup && pic
                ? `${process.env.REACT_APP_SERVER_URL}/images/profiles/${pic}`
                : "/images/no-profile-picture.svg"
            }
          />
        </div>
      )}
      <div
        className={`relative min-w-[90px] bg-gradient-to-l px-5 pb-6 rounded-2xl text-white ${
          isMy
            ? "from-blue-800 to-blue-600 rounded-tr-none pt-3"
            : "from-orange-500 to-orange-700 rounded-tl-none"
        } ${isGroup && !isMy ? "pt-6" : "pt-3"}`}
      >
        {isGroup && !isMy && (
          <div className="absolute text-xs font-bold top-1 left-2 text-orange-300 rounded-br-md">
            {userName ? userName : sender}
          </div>
        )}
        {message}
        <div
          className={`absolute text-xs bottom-1 ${
            isMy ? "right-5 text-blue-300" : "left-5 text-orange-300"
          }`}
        >
          {time}
        </div>
      </div>
    </div>
  );
};

export default Message;

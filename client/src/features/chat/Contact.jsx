import React, { useEffect, useState } from "react";
import useAuth from "../../hook/useAuth";
import { socket } from "../../socket";

const Contact = ({
  details,
  setConversationId,
  isActive,
  fetchIt,
  lastMessageSent,
  onContactUpdate,
}) => {
  const { isGroupChat, title, participants, latestMessage, _id } = details;
  const [participant, setParticipant] = useState("");
  const [participantPic, setParticipantPic] = useState("");
  const { auth } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);
  const [lastMessage, setLastMessage] = useState(latestMessage?.text);

  const colorClass = isActive
    ? "bg-gradient-to-l from-blue-800 to-blue-600 text-white"
    : "bg-white hover:bg-blue-100";

  const resetNotificationCount = () => {
    setNotificationCount(0);
  };

  useEffect(() => {
    if (isActive) {
      setLastMessage(lastMessageSent.text);
      onContactUpdate(_id);
    }
  }, [lastMessageSent]);

  useEffect(() => {
    const onNotificationReceived = (notification) => {
      if (_id === notification.id) {
        setLastMessage(notification.text);
        if (!notification.isActive) {
          setNotificationCount((prevCount) => prevCount + 1);
          onContactUpdate(_id);
        }
      }
    };

    socket.on("notification", onNotificationReceived);

    return () => {
      socket.off("notification", onNotificationReceived);
    };
  }, []);

  useEffect(() => {
    setLastMessage(latestMessage?.text);
  }, [latestMessage]);

  useEffect(() => {
    if (!isGroupChat) {
      participants.forEach((p) => {
        if (p.email !== auth.currentUser) {
          setParticipant(p.name ? p.name : p.email);
          setParticipantPic(p.pic ? p.pic : "");
        }
      });
    }
  }, []);

  return (
    <a
      href="#"
      className="relative"
      onClick={() => {
        setConversationId(details._id);
        resetNotificationCount();
        fetchIt((preVal) => !preVal);
      }}
    >
      <div
        className={`group p-4 mt-4 rounded-lg shadow-md ring-1 ring-gray-900/5 overflow-hidden ${colorClass} flex flex-row min-w-[204px]`}
      >
        {notificationCount > 0 && !isActive && (
          <span className="absolute top-5 right-1 rounded-full bg-red-500/90 w-4 h-4 text-white text-center text-xs">
            {notificationCount}
          </span>
        )}
        <div className="mr-3 rounded-full overflow-hidden ring-1 ring-gray-100 group-hover:ring-blue-200 w-10 h-10 flex justify-center items-center">
          <img
            src={
              participantPic
                ? `${process.env.REACT_APP_SERVER_URL}/images/profiles/${participantPic}`
                : "/images/no-profile-picture.svg"
            }
            alt="contact-profile"
          />
        </div>
        <div className="truncate max-w-[120px]">
          <h5 className="font-medium text-sm">
            {isGroupChat ? title : participant}
          </h5>
          <p className="font-light text-sm truncate">{lastMessage}</p>
        </div>
      </div>
    </a>
  );
};

export default Contact;

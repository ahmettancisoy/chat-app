import Header from "./Header";
import Contact from "../features/chat/Contact";
import Message from "../features/chat/Message";
import CircleButton from "../features/chat/components/CircleButton";
import { faUsers, faUserPlus, faPoo } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import AddUserModal from "../features/chat/AddUserModal";
import AddGroupModal from "../features/chat/AddGroupModal";
import useAxiosPrivate from "../hook/useAxiosPrivate";
import MessageInput from "../features/chat/components/MessageInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAuth from "../hook/useAuth";
import moment from "../api/messageDateFormat";
import { socket } from "../socket";
import Profile from "../features/profile/Profile";

const Layout = () => {
  const { auth } = useAuth();
  const [userModal, setUserModal] = useState(false);
  const [groupModal, setGroupModal] = useState(false);
  const [fetchIt, setFetchIt] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [lastMessageSent, setLastMessageSent] = useState([]);
  const messageInputRef = useRef(null);
  const [conversationId, setConversationId] = useState("");
  const [leaveConversation, setLeaveConversation] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(auth.profilePic);
  const [userName, setUserName] = useState(auth.userName);

  useEffect(() => {
    socket.connect();
    socket.emit("setup", auth.uid);
    socket.on("connected", () => setIsConnected(socket.connected));

    getConversations();
  }, []);

  const sortConversations = (data) => {
    const sortedConversations = data.sort((a, b) => {
      const dateA = new Date(a.updatedAt);
      const dateB = new Date(b.updatedAt);
      return dateB - dateA;
    });

    return sortedConversations;
  };

  const sortedConversations = conversations.sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );

  const getConversations = async () => {
    try {
      const response = await axiosPrivate.get("/");

      const sortedConversations = sortConversations(response.data);

      setConversations(response.data);
      console.log(sortedConversations);
    } catch (err) {
      console.error(err);
    }
  };

  const handleContactUpdate = (updatedContact) => {
    setConversations((prevConversations) => {
      const updatedConversation = prevConversations.map((c) =>
        c._id === updatedContact ? { ...c, updatedAt: new Date() } : c
      );
      const sortedConversations = sortConversations(updatedConversation);
      console.log(sortedConversations);
      return sortedConversations;
    });
  };

  const handleSetConversation = (convId) => {
    setConversationId(convId);
  };

  useEffect(() => {
    if (conversationId !== undefined && conversationId !== "") {
      getMessages(conversationId);
      messageInputRef.current.focus();
    }
  }, [fetchIt]);

  useEffect(() => {
    const onMessageReceived = (newMessageReceived) => {
      if (
        conversationId === newMessageReceived.conversation._id &&
        conversationId !== leaveConversation
      ) {
        setMessages((prevMessages) => [newMessageReceived, ...prevMessages]);
      }
    };

    socket.on("message received", onMessageReceived);

    return () => {
      socket.off("message received", onMessageReceived);
    };
  }, [conversationId]);

  useEffect(() => {
    const onConversationReceived = (newConversationReceived) => {
      console.log(newConversationReceived);
      setConversations((prevConversations) => [
        ...prevConversations,
        newConversationReceived,
      ]);
    };
    socket.on("conversation received", onConversationReceived);

    return () => {
      socket.off("conversation received", onConversationReceived);
    };
  });

  const getMessages = async (conversation) => {
    try {
      const response = await axiosPrivate.post("/getMessages", {
        conversation,
      });
      setMessages(response.data.reverse());
      setLeaveConversation(conversation);

      if (response.data.length > 0 && response.data[0].conversation.isGroupChat)
        socket.emit("join conversation", conversation, leaveConversation);
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async (e, text) => {
    e.preventDefault();
    if (text === "" || text === null) return null;

    const trimmedText = text.trim();

    if (trimmedText === "" || trimmedText === null) return null;

    socket.emit("stop typing", conversationId);

    try {
      const response = await axiosPrivate.post("/sendMessage", {
        conversation: conversationId,
        text: trimmedText,
      });
      socket.emit("new message", response.data);
      setMessages((prevMessages) => [response.data, ...prevMessages]);
      setLastMessageSent(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const openUserModal = () => {
    setUserModal(!userModal);
  };

  const openGroupModal = () => {
    setGroupModal(!groupModal);
  };

  if (!conversations) return null;

  return (
    <div className="w-screen h-screen bg-gradient-to-b from-white to-blue-100 overflow-y-hidden">
      <Profile
        open={isProfileOpen}
        setOpen={setIsProfileOpen}
        profilePic={profilePic}
        setProfilePic={setProfilePic}
        setUserName={setUserName}
      />
      <AddUserModal
        openModal={openUserModal}
        isOpen={userModal}
        setConversations={setConversations}
      />
      <AddGroupModal
        openModal={openGroupModal}
        isOpen={groupModal}
        conversations={conversations}
        setConversations={setConversations}
      />
      <Header
        setOpen={setIsProfileOpen}
        profilePic={profilePic}
        userName={userName}
      />
      <div className="flex flex-row h-[90%] mt-4">
        <div className="w-[14%] h-[calc(98%-72px)] min-w-[248px] px-4 pb-4 overflow-y-scroll scrollbar container">
          {conversations?.length > 0 ? (
            sortedConversations.map((c) => (
              <Contact
                key={c._id}
                details={c}
                setConversationId={handleSetConversation}
                isActive={conversationId === c._id ? true : false}
                fetchIt={setFetchIt}
                lastMessageSent={lastMessageSent}
                onContactUpdate={handleContactUpdate}
              />
            ))
          ) : (
            <p>No conversations to display</p>
          )}
        </div>
        <div className="fixed bottom-[2%] w-[14%] min-w-[250px]">
          <div className="flex justify-center px-6">
            <CircleButton icon={faUserPlus} onClick={openUserModal} />
            <CircleButton icon={faUsers} onClick={openGroupModal} />
          </div>
        </div>
        <div className="p-4 h-[calc(98%-76px)] w-[calc(100vw-318px)] ml-3">
          <ul
            className={`space-y-12 space-y-reverse flex flex-col-reverse max-h-full h-full overflow-y-auto scrollbar ${
              conversationId ? "items-end justify-start" : "justify-center"
            }`}
          >
            {conversationId ? (
              messages?.length > 0 ? (
                messages.map((m, index) => (
                  <Message
                    key={m._id}
                    sender={m.sender.email}
                    userName={m.sender.name}
                    message={m.text}
                    time={moment(m.createdAt)}
                    isGroup={m.conversation.isGroupChat}
                    showProfilePic={
                      index === messages.length - 1 ||
                      (m.sender.email !== messages[index + 1].sender.email &&
                        m.conversation.isGroupChat)
                    }
                    pic={m.sender.pic}
                  />
                ))
              ) : (
                <p>No messages to display</p>
              )
            ) : (
              <p>
                <FontAwesomeIcon
                  icon={faPoo}
                  className="text-blue-200/75 transparent h-[calc(100vh-280px)] text-center w-full"
                />
              </p>
            )}
          </ul>
        </div>
        <MessageInput
          sendMessage={sendMessage}
          convId={conversationId}
          messageInputRef={messageInputRef}
        />
      </div>
    </div>
  );
};

export default Layout;

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { socket } from "../../../socket";
import Lottie from "lottie-react";
import typingAnim from "../../../animations/typing.json";

const MessageInput = ({ sendMessage, convId, messageInputRef }) => {
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const typingHandler = () => {
    if (!typing && convId) {
      setTyping(true);
      socket.emit("typing", convId);
    }
  };

  useEffect(() => {
    setIsTyping(false);
  }, [convId]);

  useEffect(() => {
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      socket.emit("stop typing", convId);
      setTyping(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [message]);

  return (
    <div className="absolute w-[calc(100vw-326px)] ml-[284px] max-h-40 bottom-[2%]">
      {isTyping && (
        <Lottie
          animationData={typingAnim}
          loop={true}
          className="absolute w-32 -top-[60px] -left-6 pointer-events-none"
        />
      )}
      <form
        onSubmit={(e) => {
          setMessage("");
          sendMessage(e, message);
        }}
      >
        <input
          className="bg-white rounded-full w-[calc(100%-70px)] p-4 ring-1 ring-gray-900/5 shadow-md focus:outline-none"
          type="text"
          placeholder="Type a message"
          value={message}
          autoComplete="off"
          autoFocus={true}
          ref={messageInputRef}
          onChange={(e) => {
            setMessage(e.target.value);
            typingHandler();
          }}
        />

        <button className={"ml-1 h-14 w-12"} type="submit">
          <FontAwesomeIcon
            icon={faPaperPlane}
            className="gradien text-blue-800 text-xl"
          />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;

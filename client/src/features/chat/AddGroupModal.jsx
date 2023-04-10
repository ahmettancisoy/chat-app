import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import ModalInputText from "./components/ModalInputText";
import Loader from "../auth/components/Loader";
import useAxiosPrivate from "../../hook/useAxiosPrivate";
import { socket } from "../../socket";
import useAuth from "../../hook/useAuth";
import Badge from "./components/Badge";
import SearchBoxResult from "./components/SearchBoxResult";

const AddGroupModal = ({
  openModal,
  isOpen,
  conversations,
  setConversations,
}) => {
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState("");
  const [error, setError] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();

  const participantsEmail = participants.map((p) => p.email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !participants) {
      setError("All fields are required");
      return;
    }

    if (participants < 2) {
      setError("Participants required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosPrivate.post("/group", {
        title,
        participantsEmail,
      });
      if (response.status !== 201) {
        setIsLoading(false);
        console.log(response.data);
        setTitle("");
        setParticipants([]);
        openModal();
      }

      console.log(response.data);

      socket.emit("new conversation", response.data, auth.uid);
      setConversations((prevConv) => [...prevConv, response.data]);

      openModal();
      setTitle("");
      setParticipants([]);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setTitle("");
      setParticipants([]);
      console.log(err);
    }
  };

  const handleSearch = (e) => {
    if (e.length > 0) setIsSearching(true);
    else setIsSearching(false);
  };

  const handleResultClick = (participant) => {
    setIsSearching(false);
    setSearch("");
    setParticipants((prevParticipant) => [...prevParticipant, participant]);
  };

  const contacts = conversations.flatMap((c) => {
    return c.participants.filter((p) => {
      return (
        p.email !== auth.currentUser &&
        !c.isGroupChat &&
        p.email.includes(search) &&
        !participants.some((included) => included.email === p.email)
      );
    });
  });

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={openModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white p-6 text-left align-middle transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Create Group Chat
                </Dialog.Title>
                <form
                  className="relative"
                  method="POST"
                  onSubmit={handleSubmit}
                >
                  <div className="mt-2">
                    <ModalInputText
                      label="Enter title for your group"
                      name="title"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="mt-6">
                    <ModalInputText
                      label="Search contacts"
                      name="search"
                      id="search"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        handleSearch(e.target.value);
                      }}
                    />
                  </div>
                  {isSearching && (
                    <SearchBoxResult
                      searchResults={contacts}
                      handleResultClick={handleResultClick}
                    />
                  )}
                  <div className="my-2 flex flex-wrap">
                    {participants?.length > 0 &&
                      participants.map((p) => (
                        <Badge
                          key={p._id}
                          name={p.email}
                          setParticipants={setParticipants}
                        />
                      ))}
                  </div>
                  <div className="mt-4">
                    <button
                      type="submit"
                      className="min-w-[64px] inline-flex justify-center rounded-md bg-gradient-to-r from-blue-500 to-blue-700 px-4 py-2 text-sm font-medium text-white hover:drop-shadow-md focus:outline-none focus:ring-0 focus:ring-offset-0 disabled:from-blue-400 disabled:to-blue-600 disabled:text-slate-100 disabled:hover:drop-shadow-none"
                      disabled={isLoading ? true : false}
                    >
                      {isLoading ? <Loader /> : "Create"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddGroupModal;

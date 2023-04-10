import { useState, useRef, useEffect } from "react";
import { Transition } from "@headlessui/react";
import {
  faArrowLeft,
  faCamera,
  faPen,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAuth from "../../hook/useAuth";
import useAxiosPrivate from "../../hook/useAxiosPrivate";
import useAxiosPrivateUpload from "../../hook/useAxiosPrivateUpload";

const Profile = ({ open, setOpen, profilePic, setProfilePic, setUserName }) => {
  const { auth } = useAuth();
  const [photoHover, setPhotoHover] = useState(false);
  const [edit, setEdit] = useState(false);
  const [profileName, setProfileName] = useState(
    auth.userName !== undefined ? auth.userName : ""
  );
  const nameInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const axiosPrivate = useAxiosPrivate();
  const axiosPrivateUpload = useAxiosPrivateUpload();

  const onEdit = () => {
    setEdit((preVal) => !preVal);
  };

  const onEditDone = async () => {
    try {
      const response = await axiosPrivate.patch("/profile/name", {
        userName: profileName,
      });
      onEdit();
      setUserName(profileName);
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const uploadProfilePic = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("profilePic", file, file.name);
    formData.append("email", auth.currentUser);

    const response = await axiosPrivateUpload.patch("/profile/pic", formData);
    setProfilePic(response.data.fileName);
  };

  useEffect(() => {
    if (edit) nameInputRef.current.focus();
  }, [edit]);

  return (
    <Transition.Root show={open}>
      <div className="max-w-sm right-0 absolute z-10 overflow-hidden">
        <Transition.Child
          enter="transform transition ease-in-out duration-300"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition ease-in-out duration-300"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <div className="flex h-screen flex-col backdrop-blur bg-gradient-to-bl from-violet-400 via-blue-400 to-teal-400 p-16">
            <div className="absolute left-0 top-0 ml-4 flex pr-2 pt-4 sm:ml-4 z-10 text-2xl">
              <button
                type="button"
                className="text-gray-100 hover:text-white"
                onClick={() => setOpen(false)}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
            </div>
            <div className="px-4 sm:px-6 pt-10 flex flex-col items-center">
              <button
                type="button"
                className="relative rounded-full w-48 h-48 overflow-hidden ring-4 ring-gray-200 bg-white"
                onMouseEnter={() => setPhotoHover(true)}
                onMouseLeave={() => setPhotoHover(false)}
                onClick={handleFileSelect}
              >
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={uploadProfilePic}
                  name="profilePic"
                />
                {photoHover && (
                  <div className="flex flex-col absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white w-48 h-48 rounded-full bg-black/50 justify-center">
                    <span className="text-3xl">
                      <FontAwesomeIcon icon={faCamera} />
                    </span>
                    <span className="text-md mt-2 px-10">
                      Change your profile photo
                    </span>
                  </div>
                )}
                <img
                  src={
                    profilePic
                      ? `${process.env.REACT_APP_SERVER_URL}/images/profiles/${profilePic}`
                      : "/images/no-profile-picture.svg"
                  }
                />
              </button>
            </div>
            <div
              className={`mt-16 pb-2 flex flex-row justify-between text-white text-lg ${
                edit ? "border-b-2 border-b-emerald-600" : "border-none"
              }`}
            >
              <input
                type="text"
                className="bg-transparent text-white placeholder-white focus:outline-none text-base w-full"
                disabled={!edit}
                placeholder={auth.currentUser}
                ref={nameInputRef}
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                maxLength={25}
              />
              {edit ? (
                <button onClick={onEditDone}>
                  <FontAwesomeIcon icon={faCheck} />
                </button>
              ) : (
                <button onClick={onEdit}>
                  <FontAwesomeIcon icon={faPen} />
                </button>
              )}
            </div>
          </div>
        </Transition.Child>
      </div>
    </Transition.Root>
  );
};

export default Profile;

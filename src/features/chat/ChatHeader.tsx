import { useDispatch } from "react-redux";
import { setContact } from "../../app/store/slices/chatSlice.ts";
import { IoArrowBack } from "react-icons/io5";

const ChatHeader = ({ contactInfo, isOnline, setSearchParams }: any) => {
  const dispatch = useDispatch();

  return (
    <div className="Chat-box border-b border-gray-200 dark:border-slate-800 px-2 flex w-full bg-white dark:bg-[#0b0f19] transition-colors duration-300">
      <div className="flex items-center justify-center ">
        <span className="cursor-pointer text-black dark:text-white" onClick={() => {
          setSearchParams((prev: URLSearchParams) => {
            prev.delete('chat');
            return prev;
          });
          dispatch(setContact(null));
        }}>
          <IoArrowBack className="text-lg" />
        </span>
      </div>
      <div className="w-full flex items-center gap-4 p-2">
        <div 
          onClick={() => setSearchParams((prev: URLSearchParams) => { prev.set('profile', contactInfo?._id as string); return prev; })} 
          className="contact-profile-pic cursor-pointer rounded-full border dark:border-slate-800 min-w-14 min-h-14 overflow-hidden"
        >
          <img
            src={contactInfo?.profilePic || "https://img.wattpad.com/.../blank-profile.jpg"} // Shortened for brevity
            className="overflow-hidden"
            alt="profile"
          />
        </div>
        <div>
          <h2 className="font-medium text-lg text-black dark:text-white">
            {contactInfo?.name}
          </h2>
          <p className={`text-sm ${isOnline === 'online' ? 'text-green-500' : 'text-red-500'}`}>
            {isOnline}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
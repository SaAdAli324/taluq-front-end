import { useAppDispatch } from "../../app/hooks.ts";
import api from "../../api.ts";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {  IoClose, IoSearch, } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import type { ContactDocument,  } from "../../types/type.ts";
import { setContact, setLoading } from "../../app/store/slices/chatSlice.ts";
import { socket } from "../../utils/socket.ts";
import ConfirmModel from "../../components/ui/ConfirmModel.tsx";
import { useSelector } from "react-redux";
import { AiFillMessage, AiOutlineLoading } from "react-icons/ai";
const Contacts = () => {
  const contactInfo = useSelector((state: any) => state.contact.contactInfo)
  const dispatch = useAppDispatch();
  const [contacts, setContacts] = useState<any>([])
  const [searchedUser, setSearchedUser] = useState<any|null>({
    _id: null,
    name: null,
    email: null,
    profilePic: null
  })

  const [newMessage, setNewMessage] = useState<any>(null)
  const [openOptions, setOpenOptions] = useState<string | null>(null)
  const [openConfirmModal, setOpenConfirmModal] = useState<string | null>(null)
  const [userNameForConfirmModal, setUserNameForConfirmModal] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [, setSearchParams] = useSearchParams()
  const [isSearachingUser, setSearchingUser] = useState(false)

  // Keep a ref to contacts to avoid stale closures in the socket listener
  const contactsRef = useRef<any>([]);
  useEffect(() => {
    contactsRef.current = contacts;
  }, [contacts]);


  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setIsLoading(true)
        const response = await api.get("/api/conversation/get")// response.data.data);
        setContacts(response.data.data)
        setIsLoading(false)
      } catch (error) {// error);
        setIsLoading(false)

      }
    }
    fetchContacts()

  }, [contacts.length ,socket])

    const addContact = async (contactId: string, savedName: string|null) => {
    try {// contactId, savedName);

      if (!contactId) return
      const payload = { contactId, savedName }
      const response = await api.post('/api/conversation/add', payload)// response.data.data);

      setContacts((prev:any) => [...prev, response.data.data])

      setSearchedUser(null)

    } catch (error) {// error);

    }
  }

  useEffect(() => {
    socket.on("receive_message", (incomingData) => {
      
      if (incomingData && incomingData.message) {
        setNewMessage(incomingData.message)// "this is the message comming", incomingData.message)
      
        const conversationExists = contactsRef.current.some((conv: any) =>
          conv.participants.some((participant: any) => participant._id === incomingData.message.sender)
        );

        if (!conversationExists) {
           addContact(incomingData.message.sender, null)
        }
      }
    })
    return () => {
      socket.off("receive_message")
    }
  }, [socket])


  const searchUSER = async (_id: string) => {
    try {
      if (!_id.trim()) return
      const query: any = {
        _id
      }
      const response = await api.post("/api/search/user", query)// response.data.data);
      setSearchedUser(response.data.data)

    } catch (error) {// error);

    }
  }


  const openChatBox = async (conversationId: string, contact: any) => {
    if (contactInfo?._id === contact?._id) {
      return
    }
    const payload = {
      ...contact,
      conversationId: conversationId
    }
    dispatch(setContact(payload))
    setSearchParams((prev: URLSearchParams) => {
      prev.set('chat', conversationId);
      return prev;
    });
  }

  const openProfile = (userId: string) => {
    setSearchParams({ profile: userId })
  }

  const deleteResource = async (endpoint: string) => {
    try {
      setIsLoading(true)
      
      const response = await api.delete(`api/conversation/delete/${openConfirmModal}`)// response.data)
       if (response.data.success===true) {

      setContacts((prev:any)=> prev.filter((m:any)=> m._id !== openConfirmModal))
        
       }
      setIsLoading(false)
      setOpenConfirmModal(null)

    } catch (error) {// `error in deleting resource ${endpoint} :`, error);
      setIsLoading(false)
    }
  }
  return (
    <div
      className="Chat-box flex flex-col gap-2 px-1 py-3"
    >

      <div className="flex relative items-center justify-center w-full min-w-0 ">
        <input
          type="search"
          placeholder="Search by id and hit enter"
          className="chat-input  w-full min-w-0 "
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchUSER(e.currentTarget.value)
            }
          }}
          onChange={(e) => {
            setSearchingUser(true)
            if (e.target.value === "") {
              setSearchingUser(false)
              setSearchedUser({
                _id: null,
                name: null,
                email: null,
                profilePic: null
              })
            }
          }}
        />
        {isSearachingUser ? "" : <IoSearch className="absolute right-5" />}
      </div>
 {searchedUser && searchedUser.length >0 ? <div className="flex flex-col  py-1 pb-4 dark:bg-slate-900 bg-slate-100">
        {searchedUser && searchedUser.length >0 ? searchedUser.map((m: any) => {
        return (
          <div className=" dark:border-slate-800 relative w-full h-14  flex items-center gap-2 px-1 hover:bg-slate-100 dark:hover:bg-slate-800 bg-white dark:bg-[#262d3b] transition-all duration-300">
            <div className="min-w-12  max-w-12 max-h-12  dark:border-slate-700 min-h-12 rounded-full overflow-hidden "><img src={m.profilePic ? m.profilePic : "https://static.vecteezy.com/system/resources/previews/036/280/651/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg"} alt="" /></div>
            <h2>{m.name ? m.name : ""}</h2>
            <AiFillMessage className="absolute right-4 cursor-pointer text-slate-600 dark:text-slate-300" onClick={() => addContact(m._id as string, m.name as string)} />
         
        </div>)
      }) : null
      }

  </div>:null}

      <div className="">
        {isLoading ? <div className="flex w-full justify-center pt-2"> <AiOutlineLoading className="animate-spin" /></div> : null}
        {contacts.length > 0 &&
          contacts.map((contact:any) => {
            return (
              <>
                <div key={contact._id} onClick={() => openChatBox(contact._id as string, contact.participants[0] as any)} className="chat-bullet text-black dark:text-white transition-colors duration-300">
                  <div onClick={(e) => (e.stopPropagation(), openProfile(contact.participants[0]._id as string))} className="contact-profile-pic rounded-full min-w-14 min-h-14 overflow-hidden  dark:border-slate-800">
                    {
                      contact.participants.map((participant:any) => {
                        return (
                          <img
                            loading="lazy"
                            src={participant.profilePic ? participant.profilePic : "https://img.wattpad.com/8f19b412f2223afe4288ed0904120a48b7a38ce1/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f5650722d38464e2d744a515349673d3d2d3234323931353831302e313434336539633161633764383437652e6a7067?s=fit&w=720&h=720"}
                            className="overflow-hidden"
                            alt=""
                          />
                        )
                      })
                    }

                  </div>
                  <div className=" w-full flex flex-col justify-between min-w-0 ">
                    <h2 className="font-medium truncate">{contact.participants[0]?.name ? contact.participants[0].name : "user"}</h2>
                    <div className=" w-full flex  gap-2 justify-between  items-center min-w-0 ">
                      <p className={`truncate ${newMessage && newMessage.conversationId === contact._id && newMessage.seen === false ? 'font-semibold text-black dark:text-white' : 'font-medium text-sm text-slate-500 dark:text-slate-400 w-full min-w-0 max-w-xs max-h-fit min-h-fit'} `}>
                        {newMessage && newMessage.conversationId === contact._id ? newMessage.text ? newMessage.text : "no message yet" : contact.lastMessage ? contact.lastMessage.text : "No message yet"}
                      </p>
                      <div className="flex items-center  justify-center gap-2 relative min-h-8">
                        {openOptions === contact._id ? (
                          <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                            <button onClick={() => (setOpenConfirmModal(contact._id as string), setOpenOptions(null), setUserNameForConfirmModal(contact?.participants[0]?.name))} className="flex cursor-pointer items-center gap-1 px-3 py-1 text-sm font-bold text-red-600 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-full transition-all group">
                              <MdDeleteOutline className="text-lg  group-hover:scale-110 transition-transform" />
                              <span>Delete</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenOptions(null);
                              }}
                              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer rounded-full transition-colors text-slate-500 dark:text-slate-400"
                              title="Cancel"
                            >
                              <IoClose className="text-xl" />
                            </button>
                          </div>
                        ) : (
                          <>
                            {contact.lastMessage ? <p className="text-xs text-slate-500 dark:text-slate-400 min-w-fit ">{new Date(contact.lastMessage.createdAt).toLocaleTimeString()}</p> : null}
                            <span
                              className="text-lg flex items-center justify-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full w-8 h-8 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenOptions(contact._id);
                              }}
                            >
                              <BsThreeDotsVertical className="text-slate-500 dark:text-slate-400" />
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

              </>
            );
          })}

      </div>
      {openConfirmModal !== null &&
        <ConfirmModel loading={Boolean(isLoading)}
          isOpen={openConfirmModal !== null} title="Delete"
          message={`Are you sure you want to delete this message?`}
          onConfirm={() => { deleteResource(openConfirmModal) }}
          onCancel={() => setOpenConfirmModal(null)} />

      }
    </div>



  );
};

export default Contacts;
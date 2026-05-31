import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { socket } from "../utils/socket.ts";
import { useAppSelector } from "../app/hooks.ts";
import api from "../api.ts"
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "../cutomHooks/Loader.tsx";
import { model } from "../cutomHooks/openModel.tsx";
import { ModelLoader } from "../cutomHooks/Loader.tsx";
import { useSearchParams } from "react-router-dom";
import { setLoading } from "../app/store/slices/chatSlice.ts";
export const ChatHooks = (contactInfo: any, user: any) => {
    const [search, setSearchParams] = useSearchParams()
    const [messages, setMessages] = useState<any[]>([])
    const [openOptions, setOpenOptions] = useState<string | null>(null)
    const [isOnline, setIsOnline] = useState<string | null>("offline")
    const { isLoading, startLoading, stopLoading } = Loader(false)
    const { isModelLoading, startModelLoading, stopModelLoading } = ModelLoader(false)
    const { openModel, closeModel, activeModel } = model(null)
    const [openUpdateModel, setOpenUpdateModel] = useState<string | null>(null)
    const [currentMessage, setCurrentMessage] = useState<string | null>(null)
    const [isTyping, setIsTyping] = useState<boolean>(false)
    const [text, setText] = useState<string>("")
    const [showStickers, setShowStickers] = useState(false)
    const chatBoxRef = useRef<HTMLDivElement>(null)
    const olderMessages = useRef<HTMLDivElement>(null)
    const allMessages = []
    const typingTimer = useRef<any>(null)
    const [showGiphy, setShowGiphy] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingOlder, setIsFetchingOlder] = useState(false);
    useEffect(() => {
        console.log("i am use effect");

        if (!contactInfo?._id) return
        const fetchMessages = async () => {
            try {
                startLoading()
                const response = await api.get(`/api/messages/${contactInfo?.conversationId}?page=1`)
                console.log(response.data.data);
                allMessages.unshift(...response.data.data)
                
                setMessages(response.data.data);
                setHasMore(response.data.hasMore);
                setPage(1);
                stopLoading()
            } catch (error) {
                console.log(error);
                setHasMore(false);
                stopLoading()
            }
        }
        fetchMessages()
    }, [contactInfo?.conversationId]);

    const loadMoreMessages = async () => {
        if (isFetchingOlder || !hasMore) return; // Prevent double-fetching

        try {
            setIsFetchingOlder(true);
      
            const nextPage = page + 1;
            const response = await api.get(`/api/messages/${contactInfo?.conversationId}?page=${nextPage}`);

            const olderMessages = response.data.data;

            // Prepend the older messages to the top of the array!
            setMessages((prev) => [...olderMessages, ...prev]);

            setHasMore(response.data.hasMore);
            console.log(response.data.hasMore);
            
            setPage(nextPage);
        
            console.log("working" , hasMore);
            
        } catch (error) {
            console.log("Error loading older messages", error);
            setHasMore(false);
        } finally {
            setIsFetchingOlder(false);
        }
    };
    useEffect(() => {
        console.log("i am socket use effect");

        if (!contactInfo?._id) return

        // const handleGetOnlineUsers = (userId: {userId:string, status:string}) => {
        //   console.log("these are the online users", userId);
        //   setIsOnline(userId.includes(contactInfo?._id as string))
        // }

        const handleUserJoined = (newUser: []) => {
            console.log(newUser, "this is handel user");

            newUser.forEach(m => {
                if (m as string === contactInfo?._id) {
                    setIsOnline("online")
                }
            })
        }

        const handleUserLeft = (leftUser: string) => {
            console.log(leftUser, "these are the left users");
            if (leftUser === contactInfo?._id) {
                setIsOnline("offline")
            }
        }
        // socket.on("get_online_users", handleGetOnlineUsers)
        socket.on("user_online", handleUserJoined)
        socket.on("user_offline", handleUserLeft)
        socket.emit("request_online_users")
        socket.emit("trigger_message_seen", contactInfo?.conversationId)
        socket.on('receive_message', (data) => {
            console.log(data.message, "this is data");

            if (data.message.conversationId !== contactInfo.conversationId) {
                return
            }
            socket.emit("mark_seen", data.message._id)
            setMessages((prev) => [...prev, data.message])
        });

        socket.on('delete_message', (data) => {
            setMessages((prev) => prev.map((message) => message._id === data.message._id ? { ...message, deleted: true } : message))
        })
        socket.on('update_message', (data) => {


            setMessages((prev) => prev.map(message => message._id === data.message._id ? { ...message, text: data.message.text } as string : message))
        })

        socket.on('delivered_message', (data) => {
            console.log(data.message, "this is data")
            const pendingMessagesId = new Set(data.message.map((m: any) => m._id))
            setMessages((prev) => prev.map((message) => {
                if (pendingMessagesId.has(message._id)) {
                    return { ...message, isdelivered: true }
                }
                return message
            }))

        });

        socket.on("message_seen", (data) => {
            const pendingMessagesId = new Set(data.message.map((m: any) => m._id))
            setMessages((prev) => prev.map((message) => {
                if (pendingMessagesId.has(message._id)) {
                    return { ...message, seen: true }
                }
                return message
            }))

        })
        socket.on("instant_message_seen", (data) => {
            if (data.message.conversationId !== contactInfo?.conversationId) {
                return
            }
            console.log(data.message, "this is instant message seen data");

            setMessages((prev) => prev.map((message) => {
                if (message._id === data.message._id) {
                    return { ...message, seen: true }
                }
                return message
            }))
        })
        socket.on("user_typing", (data) => {


            if (data.conversationId !== contactInfo?.conversationId) {
                return
            }
            setIsTyping(data.typing)
            if (typingTimer.current) {
                clearTimeout(typingTimer.current)
            }

            if (data.typing) {
                typingTimer.current = setTimeout(() => {
                    setIsTyping(false)

                }, 2000)
            }
            ;

        })

        return () => {
            socket.off('receive_message')
            socket.off('delete_message')
            socket.off('update_message')
            socket.off('request_online_users')
            socket.off('delivered_message')
            socket.off("user_online", handleUserJoined)
            socket.off("user_offline", handleUserLeft)
            socket.off("message_seen")
            socket.off("trigger_message_seen")
            socket.off("instant_message_seen")
            socket.off("mark_seen")
            socket.off("user_typing")
            clearTimeout(typingTimer.current)
        }
    }, [socket, contactInfo?._id])

    const sendMessage = async (message: string) => {
        try {
            const _id = Math.random().toString()
            let type = "text"
            setMessages((prev) => [...prev, { text: message as string, createdAt: new Date().toLocaleDateString(), sender: user?._id, seen: false, __v: 0, _id: _id }])
            const response = await api.post(`/api/messages/send/${type}/${contactInfo?._id}/${contactInfo?.conversationId}`, { message })
            setMessages((prev) => prev.map(m => m._id === _id ? response.data.data : m))
            console.log(response.data);

        } catch (error) {
            console.log(error);
        }
    }
    const sendFileMessage = async (file: File) => {
        try {
            const tempId = Math.random().toString()
            let type = "file"
            if (file.type.startsWith("image/")) {
                type = "image"
            } else if (file.type.startsWith("video/")) {
                type = "video"
            }

            const localUrl = (type === "image" || type === "video") 
                ? URL.createObjectURL(file) 
                : JSON.stringify({ url: "#", name: file.name })

            setMessages((prev) => [...prev, { 
                type: type, 
                text: localUrl, 
                createdAt: new Date().toISOString(), 
                sender: user?._id, 
                seen: false, 
                __v: 0, 
                _id: tempId,
                issend: false 
            }])

            const formData = new FormData()
            formData.append("file", file)

            const response = await api.post(
                `/api/messages/send-file/${contactInfo?._id}/${contactInfo?.conversationId}`, 
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            )

            setMessages((prev) => prev.map(m => m._id === tempId ? response.data.data : m))
            console.log(response.data);
        } catch (error) {
            console.log("error while sending file message", error);
        }
    }
    const handleSendSticker = async (message: string) => {

        try {
            const type = "image"
            const _id = Math.random().toString()
            setMessages((prev) => [...prev, { type: "image", text: message as string, createdAt: new Date().toLocaleDateString(), sender: user?._id, seen: false, __v: 0, _id: _id }])
            const response = await api.post(`/api/messages/send/${type}/${contactInfo?._id}/${contactInfo?.conversationId}`, { message: message })
            setMessages((prev) => prev.map(m => m._id === _id ? response.data.data : m))
            console.log(response.data);
            setShowGiphy(false);
        }
        catch (error) {
            console.log("error while sending sticker", error);
        }
    };

    const instantUpdate = async (messageId: string, text: string) => {
        try {
            const currentMessage = messages.find((m) => m._id === messageId)
            if (text.trim() === currentMessage?.text) {
                setOpenUpdateModel(null)
                setOpenOptions(null)
                return
            }
            setMessages((prev) => prev.map((m) => {
                if (m._id === messageId) {
                    m.text = text

                }
                return m
            }));

            const response = await api.patch(`/api/messages/update/${messageId}/${contactInfo?._id}`, { text })
            setMessages((prev) => (prev.map(m => m._id === messageId ? response.data.data : m)))
            console.log(response.data);

            setOpenUpdateModel(null)
            setOpenOptions(null)


        } catch (error) {
            console.log("error while instant updating", error);

        }
    }

    const patchResource = async (messageId: string) => {
        try {
            startModelLoading()
            if (!messageId) {
                stopModelLoading()
                console.log("no message id provided");
                return
            }
            setMessages((prev) => prev.map((message) => message._id === messageId ? { ...message, deleted: true } : message))
            const response = await api.patch(`/api/messages/delete/${messageId}/${contactInfo?._id}`)
            console.log("this is resopnse ", response.data.data);
            setMessages((prev) => prev.map((message) => message._id === messageId ? response.data.data : message))
            stopModelLoading()
            closeModel()
            setOpenOptions(null)

        } catch (error) {
            stopModelLoading()
            console.log(`error in patching resource ${messageId} :`, error);

        }
    }
    return {
        messages,
        isOnline,
        isTyping,
        sendMessage,
        sendFileMessage,
        instantUpdate,
        patchResource,
        handleSendSticker,
        isLoading,
        isModelLoading,
        openModel,
        closeModel,
        activeModel,
        isFetchingOlder,
        hasMore,
        loadMoreMessages,
    };
}
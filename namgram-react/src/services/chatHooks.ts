import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const NEW_CHAT_MESSAGE_EVENT = "NEW_CHAT_MESSAGE"; // Name of the event
const SOCKET_SERVER_URL = "http://localhost:8080/chat/";

const useChat = (roomId: string) => {
  const [messages, setMessages] = useState([]); // Sent and received messages
  const socketRef = useRef<SocketIOClient.Socket>();

  useEffect(() => {
    
    // Creates a WebSocket connection
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { roomId },
    });
    
    // Listens for incoming messages
    //@ts-ignore
    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
      const incomingMessage = {
        ...message,
        //@ts-ignore
        ownedByCurrentUser: message.senderId === socketRef.current.id,
      };
      //@ts-ignore
      setMessages((messages) => [...messages, incomingMessage]);
    });
    
    // Destroys the socket reference
    // when the connection is closed
    return () => {
        //@ts-ignore
      socketRef.current.disconnect();
    };
  }, [roomId]);

  // Sends a message to the server that
  // forwards it to all users in the same room
  //@ts-ignore
  const sendMessage = (messageBody) => {
      //@ts-ignore
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      body: messageBody,
      //@ts-ignore
      senderId: socketRef.current.id,
    });
  };

  return { messages, sendMessage };
};

export default useChat;
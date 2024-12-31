import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  unreadMessages: {},

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser, users } = get();
    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      if (!selectedUser || newMessage.senderId !== selectedUser._id ) {
        const unreadMessages = get().unreadMessages;

        const sender = users.find((user) => user._id === newMessage.senderId);
        const senderName = sender ? sender.fullName : "Someone";

        set({
          unreadMessages: {
            ...unreadMessages,
            [newMessage.senderId]:
              (unreadMessages[newMessage.senderId] || 0) + 1,
          },
        });

        toast.success(`${senderName} sent you a message`);
      } else {
        const messages = get().messages;
        set({ messages: [...messages, newMessage] });
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => {
    const unreadMessages = get().unreadMessages;

    if (selectedUser && unreadMessages[selectedUser._id]) {
      const updatedUnreadMessages = { ...unreadMessages };
      delete updatedUnreadMessages[selectedUser._id];
      set({ unreadMessages: updatedUnreadMessages });
    }

    set({ selectedUser });
  },
}));

import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';

interface WebSocketStore {
    username: string;
    webSocket: Socket | null;
    isConnected: boolean;
    messages: string[];
    connect: () => void;
    disconnect: () => void;
    setEvents: (socket: Socket) => void;
    sendMessage: (message: string) => void;
    clearMessages: () => void;
    setUsername: (username: string) => void;
}

const useWebSocket = create<WebSocketStore>((set, get) => ({
    webSocket: null,
    isConnected: false,
    messages: [],
    username: '',

    connect: () => {
        const existingSocket = get().webSocket;

        if (existingSocket) {
            console.warn("Socket is already connected.");
            return;
        }

        const socket = io();
        get().setEvents(socket);

        set({ webSocket: socket });
    },

    disconnect: () => {
        const socket = get().webSocket;

        if (socket) {
            socket.disconnect();
            set({ webSocket: null, isConnected: false });
            console.log('Socket connection closed.');
        } else {
            console.warn("No active socket connection to disconnect.");
        }
    },

    setEvents: (socket: Socket) => {
        socket.on('connect', () => {
            console.log('Connected to the Socket.IO server');
            set({ isConnected: true });
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from the Socket.IO server');
            set({ isConnected: false });
        });

        socket.on("chatMessage", (data) => {
            set({ messages: [data, ...get().messages] })
        })
    },

    sendMessage: (message: string) => {
        const {webSocket: existingSocket, username} = get();

        if (!existingSocket || !username) {
            console.warn("Socket is not connected.");
            return;
        }
        existingSocket.emit('chatMessage', {username, message});
    },

    clearMessages: () => {
        set({messages: []})
    },

    setUsername: (username: string) => {
        set({username})
    }
}));

export default useWebSocket;

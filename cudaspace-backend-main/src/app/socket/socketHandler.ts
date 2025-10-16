import { Server as SocketIOServer } from "socket.io";
import ApiError from "../../errors/ApiErrors";

export const EVENT_NOTIFICATION = "notification";
export const EVENT_NOTIFY = "notify";

interface UserSocketMap {
  [id: string]: string;
}

// Global Variables
const userSocketMap: UserSocketMap = {};
let io: SocketIOServer;

export const getReciverSocketId = (id: string) => {
  return userSocketMap[id];
};

export function initializeSocket(socketServer: SocketIOServer) {
  io = socketServer;

  // socket connection
  io.on("connection", (socket) => {
    const id = socket.handshake.query.id as string;
    console.log("Socket connected for this userId :", id);

    if (id && !userSocketMap[id]) {
      userSocketMap[id] = socket.id;
    } else {
      console.log("User already connected.");
    }

    socket.on("disconnect", () => {
      console.log("A user disconnected: ", socket.id);

      for (const id in userSocketMap) {
        if (userSocketMap[id] === socket.id) {
          delete userSocketMap[id];
          break;
        }
      }
    });
  });
}

export function getSocketInstance() {
  if (!io) {
    throw new ApiError(500, "Socket not initialized");
  }

  return io;
}

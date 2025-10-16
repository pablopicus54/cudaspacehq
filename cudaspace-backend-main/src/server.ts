import { Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import app, { corsOptions } from "./app";
import { initializeSocket } from "./app/socket/socketHandler";
import config from "./config";

let server: Server;

// Main function to start the server
function main() {
  try {
    server = app.listen(config.port, () => {
      console.log("Server is running on port", config.port);
    });

    // Initialize Socket.io
    const io = new SocketIOServer(server, {
      cors: corsOptions,
    });

    initializeSocket(io);
  } catch (error) {
    console.log(error);
  }
}

// Start the server
main();

process.on("unhandledRejection", (err) => {
  console.log(`😈 unahandledRejection is detected , shutting down ...`, err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", () => {
  console.log(`😈 uncaughtException is detected , shutting down ...`);
  process.exit(1);
});

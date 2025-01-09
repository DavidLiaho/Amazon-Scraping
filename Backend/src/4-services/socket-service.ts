import { Server as HttpServer } from "http";
import { Socket, Server as SocketServer } from "socket.io";

class SocketService {

    // Socket.io server of all sockets:
    private socketServer: SocketServer;

    // Init once:
    public init(httpServer: HttpServer): void {
        
        // Create socket server once:
        const options = { cors: { origin: "*" } };
        this.socketServer = new SocketServer(httpServer, options);

        // Listen for client connections:
        this.socketServer.sockets.on("connection", (socket: Socket) => {
            console.log("New client has been connected, Socket ID: " + socket.id);
            socket.emit("id", socket.id);
            socket.on("disconnect", () => {
                console.log("Client has been disconnected");
            });
        });
    }

    // Send message:
    public sendMessage(message: string, socketId: string): void {
        for (const socket of this.socketServer.sockets.sockets.values()) {
            if (socket.id === socketId) {
                socket.emit("message", message);
                break;
            }
        }
    }

}

export const socketService = new SocketService();
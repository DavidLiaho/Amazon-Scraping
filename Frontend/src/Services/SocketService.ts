import { Socket, io } from "socket.io-client";

class SocketService {
	
    private socket: Socket;

    public get socketId(): string {
        return this.socket.id;
    }

    public connect(callback: (message: string) => void): void {
        // Connect:
        this.socket = io("https://scraping-service-975821124714.me-west1.run.app");

        // Listen to socket id:
        this.socket.on("id", (id: string) => {
            this.socket.id = id;
        });

        // Listen to messages:
        this.socket.on("message", (message: string) => {
            callback(message);
        });
    }

    public disconnect(): void {
        this.socket.disconnect();
    }

}

export const socketService = new SocketService();

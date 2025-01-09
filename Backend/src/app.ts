import cors from "cors";
import express, { Express } from "express";
import helmet from "helmet";
import { Server as HttpServer } from "http";
import { socketService } from "./4-services/socket-service";
import { scrapingController } from "./5-controllers/scraping-controller";
import { errorMiddleware } from "./6-middleware/error-middleware";

class App {

    public expressServer: Express; // Make expressServer public for the testing.

    public start(): void {

        // Create the expressServer: 
        this.expressServer = express();

        this.expressServer.use(helmet({ crossOriginResourcePolicy: false }));

        this.expressServer.use(cors()); // Enabling CORS for any frontend address.

        // Tell express to create a request.body object from the body json:
        this.expressServer.use(express.json());

        // Connect controllers to the expressServer:
        this.expressServer.use("/api", scrapingController.router);

        // Register route not found middleware: 
        this.expressServer.use("*", errorMiddleware.routeNotFound);

        // Register catch-all middleware: 
        this.expressServer.use(errorMiddleware.catchAll);

        const httpServer: HttpServer = this.expressServer.listen(4000, () => console.log("Listening on http://localhost:" + 4000));
        socketService.init(httpServer);
    }

}

export const app = new App(); // export app for the testing.
app.start();


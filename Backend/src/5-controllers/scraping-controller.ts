import express, { NextFunction, Request, Response } from "express";
import { scrapingService } from "../4-services/scraping-service";

class ScrapingController {

    public readonly router = express.Router();

    public constructor() {
        this.router.get("/scrape-books/:text/:socketId", this.scrapeBooks);
    }

    private async scrapeBooks(request: Request, response: Response, next: NextFunction) {
        try {
            const text = decodeURIComponent(request.params.text);
            const socketId = request.params.socketId;
            const books = await scrapingService.scrapeBooks(text, socketId);
            response.json(books);
        }
        catch (err: any) { next(err); }
    }

}

export const scrapingController = new ScrapingController();

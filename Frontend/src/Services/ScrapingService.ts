import axios from "axios";
import { BookModel } from "../Models/BookModel";
import { appConfig } from "../Utils/AppConfig";
import { socketService } from "./SocketService";

class ScrapingService {

    public async scrapeBooks(text: string): Promise<BookModel[]> {
        text = encodeURIComponent(text);
        const response = await axios.get<BookModel[]>(appConfig.scrapeBooksUrl + text + "/" + socketService.socketId, { headers: { "Access-Control-Allow-Origin": true } });
        const books = response.data;
        return books;
    }

}

export const scrapingService = new ScrapingService();


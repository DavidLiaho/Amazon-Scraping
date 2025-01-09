import puppeteer, { Browser } from "puppeteer";
import { BookModel } from "../3-models/book-model";
import { socketService } from "./socket-service";

class ScrapingService {

    public async scrapeBooks(text: string, socketId: string): Promise<BookModel[]> {
        let browser: Browser;

        try {

            const books: BookModel[] = [];

            // Create Browser:
            socketService.sendMessage("Initiating a browser...", socketId);
            browser = await puppeteer.launch({ headless: true, args: [
                '--no-sandbox', // Disable sandbox for Docker compatibility
                '--disable-setuid-sandbox', // Disable the setuid sandbox
                '--disable-gpu', // Disable GPU hardware acceleration
                '--disable-dev-shm-usage' // Disable /dev/shm usage
              ], });

            // Create Page:
            socketService.sendMessage("Creating a new page...", socketId);
            const page = await browser.newPage();
            page.setDefaultTimeout(120000);

            // Go to Amazon Books Page:
            socketService.sendMessage("Browsing to Amazon...", socketId);
            const url = "https://www.amazon.com/books";
            await page.goto(url, { waitUntil: "networkidle2" });
            
            // Type text to search in search box:
            socketService.sendMessage("Searching for " + text + " books...", socketId);
            await page.waitForSelector("input#twotabsearchtextbox");

            await page.type("input#twotabsearchtextbox", text);

            await page.keyboard.press("Enter");

            await page.waitForNavigation({ waitUntil: "networkidle2" });
            
            // Wait for books selector:
            await page.waitForSelector("div.puis-card-container");
            
            // Scrape cards:
            const cards = await page.$$("div.puis-card-container");
            
            // Run on all cards:
            for (const card of cards) {
                
                // Scrape name:
                const nameElement = await card.$("h2 > span")
                const name = await nameElement?.evaluate(element => element.innerText);
                
                // Scrape price:
                let priceElement = await card.$("span.a-price > span.a-offscreen");
                if (!priceElement) {
                    priceElement = await card.$("div[data-cy='secondary-offer-recipe'] > div > span:nth-of-type(2)");
                }
                let price = await priceElement?.evaluate(element => element.innerText);
                if (!price) price = "---";
                
                // Scrape author:
                // const authorElement = await card.$("div[data-cy='title-recipe'] > div > a");
                const authorElement = await card.$(".a-row > a");
                let author = await authorElement?.evaluate(element => element.innerText);
                if (!author) author = "---";
                
                // Scrape imageUrl:
                const imageElement = await card.$("div.a-section > img");
                const imageUrl = await imageElement?.evaluate(element => element.src);
                
                // Scrape imageUrl:
                const ahrefElement = await card.$(".aok-relative a");
                let link = "https://www.amazon.com";
                link += await ahrefElement?.evaluate(element => element.getAttribute("href"));
                
                
                // Add book:
                const book = new BookModel(name, price, author, imageUrl, link);
                books.push(book);
            }
            
            // Close browser:
            await browser.close();
            
            // Return books:
            socketService.sendMessage("Found " + books.length + " books", socketId);
            return books;
        }

        finally {
            // Close browser:
            await browser.close();
        }
    }
}

export const scrapingService = new ScrapingService();
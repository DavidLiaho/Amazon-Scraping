import { ChangeEvent, useEffect, useState } from "react";
import "./Home.css";
import { notify } from "../../../Utils/Notify";
import { scrapingService } from "../../../Services/ScrapingService";
import { BookModel } from "../../../Models/BookModel";
import { socketService } from "../../../Services/SocketService";

export function Home(): JSX.Element {

    const [text, setText] = useState<string>("");
    const [books, setBooks] = useState<BookModel[]>([]);
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        socketService.connect((message: string) => setMessage(message));

        return () => {
            socketService.disconnect();
        }

    }, []);

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        setText(event.target.value);
    }

    async function scrapeBooks() {
        try {
            setBooks([]);
            const books = await scrapingService.scrapeBooks(text);
            setBooks(books);
            if (books.length === 0) {
                notify.error("No books found");
            }
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    return (
        <div className="Home">
            <div className="search-card">
                <div className="search-form">
                    <div className="input-group">
                        <label className="input-label">Search Books:</label>
                        <input
                            type="search"
                            onChange={handleChange}
                            value={text}
                            className="search-input"
                            placeholder="Enter book title..."
                        />
                    </div>
                    <button onClick={scrapeBooks} className="search-button">🔎</button>
                </div>
            </div>

            <div className="centered">
                <h3>{message}</h3>
            </div>

            {books.length > 0 && (
                <div className="table-container">
                    <table className="results-table">
                        <thead>
                            <tr className="table-header">
                                <th>Link</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Author</th>
                                <th>Image</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((book, index) => (
                                <tr key={index} className="table-row">
                                    <td className="table-cell"><a href={book.link} target="_blank">Link</a></td>
                                    <td className="table-cell">{book.name}</td>
                                    <td className="table-cell">{book.price}</td>
                                    <td className="table-cell">{book.author}</td>
                                    <td className="table-cell">
                                        <img
                                            src={book.imageUrl}
                                            alt={book.name}
                                            className="book-image"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

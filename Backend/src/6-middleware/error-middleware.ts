import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../3-models/enums";
import { NotFoundError } from "../3-models/error-models";

class ErrorMiddleware {

    public catchAll(err: any, request: Request, response: Response, next: NextFunction): void {

        // Display error: 
        console.log(err);

        // Extract status code (if no status, it means server crash): 
        const status = err.status || StatusCode.InternalServerError;

        // Extract message: 
        const message = err.message;

        // Send error back to client: 
        response.status(status).send(message);
    }

    public routeNotFound(request: Request, response: Response, next: NextFunction): void {
        next(new NotFoundError(`Route ${request.originalUrl} not found.`));
    }

}

export const errorMiddleware = new ErrorMiddleware();

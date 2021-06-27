import "reflect-metadata";
import express, { Request, Response, NextFunction } from "express";
import "express-async-errors";
import createConnection from "./database";
import { router } from "./routes";
import { AppError } from './errors/AppError';
import cors from "cors";

createConnection();
const app = express();
app.use(cors());

app.use(express.json());
app.use(router);

app.use(
    (err: Error, request: Request, response: Response, next: NextFunction) => {
        if (err instanceof AppError) {
            return response.status(400).json({
                error: err.message
            })
        }

        return response.status(500).json({
            status: "error",
            message: `Internal Server Error ${err.message}`
        })
    });

export { app };
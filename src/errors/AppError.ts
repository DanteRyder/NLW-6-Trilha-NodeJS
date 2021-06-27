export class AppError {
    public readonly message: string
    public readonly statusCode: Number

    constructor(message: string, statusCode: number = 400) {
        this.message = message
        this.statusCode = statusCode
    }
}
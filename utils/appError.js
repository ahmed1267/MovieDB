class appError extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        this.message = message;
        console.log(this.constructor)
        Error.captureStackTrace(this, this.constructor);
    }
}

export default appError;
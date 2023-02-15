class ExpressError extends Error {
    constructor(message, statusCode) {
        super(); // calls Error 
        this.message = message; 
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;
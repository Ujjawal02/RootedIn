class ApiError extends Error {
    constructor(statusCode, message = "Something went wrong", error = []){
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        this.errors = errors;
        this.data = null;
    }
}

module.exports = ApiError;
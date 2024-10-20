import { HttpStatusCode } from '../../types/http_status_codes';
import BaseError from './base_error';

class APIError extends BaseError {
    constructor(
        name: string,
        httpCode: HttpStatusCode = HttpStatusCode.INTERNAL_SERVER,
        isOperational: boolean = true,
        description: string = 'internal server error'
    ) {
        super(name, httpCode, isOperational, description);
    }
}

export default APIError;

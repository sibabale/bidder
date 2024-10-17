import AUTH_ERROR_CODES from '../data/firebase/firebase-errors.json';

export interface FirebaseError {
    code: string;
    data: { errors: string };
    status: number;
    message: string;
}

export const handleFirebaseError = (error: FirebaseError) => {
    const errorCode = error?.code;
    const errorStatus = error?.status;
    const errorMessage = error?.message || error?.data.errors;

    const unknownError = {
        code: 'unknown-error',
        status: 500,
        message: 'An unknown error occurred. Please try again later.',
    };

    if (!errorCode || !errorMessage) {
        return unknownError;
    }

    const errorMapping = Object.values(AUTH_ERROR_CODES).find((e) => e.code === errorCode);

    if (errorMapping) {
        return {
            code: errorMapping.code,
            status: errorMapping.status,
            message: errorMapping.message,
        };
    }

    if (errorCode || errorStatus || errorMessage) {
        return {
            code: errorCode,
            status: errorStatus,
            message: errorMessage,
        };
    }

    return unknownError;
};

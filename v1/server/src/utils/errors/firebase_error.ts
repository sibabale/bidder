import { FirebaseError } from '../error_handler';

export function isFirebaseError(error: any): error is FirebaseError {
    return (error as FirebaseError).code !== undefined;
}

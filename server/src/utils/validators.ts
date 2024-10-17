import validator from 'validator';

export const isValidEmail = (email: string): boolean => validator.isEmail(email);

export const isValidPassword = (password: string): boolean => {
    const isValid = validator.isStrongPassword(password, {
        minLength: 8,
        minNumbers: 0,
        minSymbols: 0,
        minUppercase: 0,
    });

    return isValid;
};

const isGenderValid = (gender: string, otherGender: string): boolean => {
    if (gender !== '') {
        return !(gender === 'Other' && otherGender === '');
    }

    return true;
};

export const isProfileValid = (
    firtName: string,
    lastName: string,
    dateOfBirth: string,
    phoneNumber: string,
    gender: string,
    otherGender: string,
): boolean => {
    return (
        !validator.isEmpty(firtName) &&
        !validator.isEmpty(lastName) &&
        !validator.isEmpty(dateOfBirth) &&
        !validator.isEmpty(phoneNumber) &&
        isGenderValid(gender, otherGender)
    );
};

export const isValidDateOfBirth = (dateOfBirth: string): boolean => {
    const isDateValid = validator.isDate(dateOfBirth, {
        format: 'DD/MM/YYYY',
        strictMode: true,
        delimiters: ['/'],
    });

    const isBeforeToday = validator.isBefore(dateOfBirth, new Date().toISOString().split('T')[0]);

    return isDateValid && isBeforeToday;
};

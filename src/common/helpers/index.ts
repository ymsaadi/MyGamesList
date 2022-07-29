import * as bcrypt from 'bcryptjs';

export const encodePassword = (value: string): string => {
    const salt: string = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(value, salt);
};

export const validateOptionalQueryNumber = (value: any, defaultValue: number): number => {
    if (isNaN(value)) {
        return defaultValue;
    }
    if (!(+value === parseInt(value, 10)) || parseInt(value, 10) < 1) {
        return defaultValue;
    }
    return parseInt(value, 10);
};

export const validateSortDirection = (value: any, defaultValue: string): string => {
    if (!value) {
        return defaultValue;
    }
    if (value !== 'asc' && value !== 'desc') {
        return defaultValue;
    }
    return value;
};

// Exclude keys from Object
export const excludeFields = <T, Key extends keyof T>(obj: T, ...keys: Key[]): Omit<T, Key> => {
    for (const key of keys) {
        delete obj[key];
    }
    return obj;
}
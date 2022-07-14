import * as bcrypt from 'bcryptjs';

export const encodePassword = (value: string): string => {
    const salt: string = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(value, salt);
};
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UserService, private readonly jwtService: JwtService) {
    }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(username);

        if (!user) {
            return null;
        }

        const isPasswordValid = bcrypt.compareSync(pass, user.password);

        if (!isPasswordValid) {
            return null;
        }

        const { password, ...result } = user;
        return result;
    }

    async register(createUserDto: CreateUserDto): Promise<User> {
        return this.usersService.create(createUserDto);
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}

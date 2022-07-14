import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../../common/services/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { username: createUserDto.username },
                    { email: createUserDto.email },
                ],
            },
        });

        if (user) {
            throw new ConflictException('user already exists');
        }

        return this.prisma.user.create({
            data: {
                username: createUserDto.username,
                email: createUserDto.email,
                password: createUserDto.password,
                firstName: createUserDto.firstName,
                lastName: createUserDto.lastName,
            },
        });
    }

    async findOne(username: string): Promise<User | undefined> {
        const user = await this.prisma.user.findUnique({
            where: {
                username,
            },
        });

        if (!user) {
            return undefined;
        }

        return user;
    }
}

import { Module } from '@nestjs/common';
import { UserModule } from './models/user/user.module';
import { AuthModule } from './models/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [UserModule, AuthModule, ConfigModule.forRoot({
        isGlobal: true,
    })],
})
export class AppModule {
}

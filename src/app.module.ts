import { Module } from '@nestjs/common';
import { UserModule } from './models/user/user.module';
import { AuthModule } from './models/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { GameModule } from './game/game.module';

@Module({
    imports: [UserModule, AuthModule, ConfigModule.forRoot({
        isGlobal: true,
    }), GameModule],
})
export class AppModule {
}

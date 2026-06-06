import { Module } from '@nestjs/common';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizationSchema } from './schemas/organization.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrganizationMemberSchema } from './schemas/organization-member.schema';
import { UserSchema } from 'src/users/schemas/user.schema';

@Module({
  controllers: [OrganizationsController],
  imports: [
    MongooseModule.forFeature([
      { name: 'Organization', schema: OrganizationSchema } ,
      { name: 'OrganizationMember', schema: OrganizationMemberSchema  },
      { name: 'User', schema: UserSchema }]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  providers: [OrganizationsService],
})
export class OrganizationsModule {}

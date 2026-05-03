import { Module } from '@nestjs/common';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizationSchema } from './schemas/organization.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrganizationMemberSchema } from './schemas/organization-member.schema';

@Module({
  controllers: [OrganizationsController],
  imports: [
    MongooseModule.forFeature([{ name: 'Organization', schema: OrganizationSchema } , { name: 'OrganizationMember', schema: OrganizationMemberSchema }]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  providers: [OrganizationsService],
})
export class OrganizationsModule {}

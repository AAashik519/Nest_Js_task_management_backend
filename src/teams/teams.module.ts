import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamSchema } from './schemas/teams.schema';
import { TeamMemberSchema } from './schemas/team-member.schems';
import { UserSchema } from '../users/schemas/user.schema';
import { OrganizationSchema } from '../organizations/schemas/organization.schema';
import { OrganizationMemberSchema } from 'src/organizations/schemas/organization-member.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports:[
    MongooseModule.forFeature([
      {name:"Team",schema:TeamSchema},
      {name:"TeamMember",schema:TeamMemberSchema},
      { name: 'Organization', schema: OrganizationSchema },
      { name: 'OrganizationMember', schema: OrganizationMemberSchema },
      { name: 'User', schema: UserSchema },
    ]),
     JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '7d' },
        }),
      }),
  ],
  controllers: [TeamsController],
  providers: [TeamsService],
 

})
export class TeamsModule {}

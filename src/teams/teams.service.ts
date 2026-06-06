import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Team } from './schemas/teams.schema';
import { Organization } from 'src/organizations/schemas/organization.schema';
import { TeamMember } from './schemas/team-member.schems';
import { CreateTeamDto } from './dto/teams.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Organization') private organizationModel: Model<Organization>,
    @InjectModel('Team') private teamModel: Model<Team>,
    @InjectModel('TeamMember') private teamMemberModel: Model<TeamMember>,
  ) {}

  async createTeam(
    dto: CreateTeamDto,
    userId:string,
    file?:Express.Multer.File

) {
    if(!Types.ObjectId.isValid(userId)){
      throw new BadRequestException('Invalid user ID')
    }

    const existingTeamName = await this.teamModel.findOne({ name: dto.name });

    if (existingTeamName) {
      throw new BadRequestException(`Team with name ${dto.name} already exists`);
    }

    const organization = await this.organizationModel.findById(dto.organizationId);

    if (!organization) {
      throw new BadRequestException('Organization not found');
    }

    const isUserMemberOfOrg = await this.organizationModel.exists({
      _id: dto.organizationId,
      members: userId,
    });

    if (!isUserMemberOfOrg) {
      throw new BadRequestException('User is not a member of the specified organization');
    }
    

    // return this.teamModel.create(dto);
  }
}

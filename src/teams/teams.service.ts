import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Team } from './schemas/teams.schema';
import { Organization } from 'src/organizations/schemas/organization.schema';
import { OrganizationMember } from 'src/organizations/schemas/organization-member.schema';
import { TeamMember } from './schemas/team-member.schems';
import { CreateTeamDto } from './dto/teams.dto';
import { uploadToCloudinary } from 'src/utils/cloudinary/cloudinary.utils';

@Injectable()
export class TeamsService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Organization') private organizationModel: Model<Organization>,
    @InjectModel('OrganizationMember')
    private organizationMemberModel: Model<OrganizationMember>,
    @InjectModel('Team') private teamModel: Model<Team>,
    @InjectModel('TeamMember') private teamMemberModel: Model<TeamMember>,
  ) {}

  async createTeam(
    dto: CreateTeamDto,
    userId:string,
    file?:Express.Multer.File

) {
  const organizationId = dto.organizationId;

    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    if (!organizationId || !Types.ObjectId.isValid(organizationId)) {
      throw new BadRequestException('Invalid organization ID');
    }

    console.log('Creating team with DTO:', dto);

    const existingTeamName = await this.teamModel.findOne({
      name: dto.name,
      organizationId: organizationId,
    });

    if (existingTeamName) {
      throw new BadRequestException(`Team with name ${dto.name} already exists`);
    }

    const organization = await this.organizationModel.findById(organizationId);

    if (!organization) {
      throw new BadRequestException('Organization not found');
    }

    const isUserMemberOfOrg = await this.organizationMemberModel.exists({
      organizationId,
      userId,
    });

    const isOrgOwner = organization.ownerId === userId;

    if (!isUserMemberOfOrg && !isOrgOwner) {
      throw new BadRequestException('User is not a member of the specified organization');
    }

    if (file) {
      const result = await uploadToCloudinary(file);
      dto.image = result.secure_url;
    }

    const team = await this.teamModel.create({
      ...dto,
      organizationId: organization._id,
    });

    await this.teamMemberModel.create({
      userId,
      teamId: team._id.toString(),
      role: 'admin',
    });

    return {
      message: 'Team created successfully',
      statusCode: 201,
      data: team,
    };
  }
}

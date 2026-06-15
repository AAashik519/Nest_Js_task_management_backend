import { BadRequestException, ConflictException, ForbiddenException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Team } from './schemas/teams.schema';
import { Organization } from 'src/organizations/schemas/organization.schema';
import { OrganizationMember } from 'src/organizations/schemas/organization-member.schema';
import { TeamMember } from './schemas/team-member.schems';
import { CreateTeamDto, UpdateTeamDto, AddTeamMemberDto, TeamRole } from './dto/teams.dto';
import { uploadToCloudinary } from 'src/utils/cloudinary/cloudinary.utils';
import { OrgRole } from 'src/utils/EmunsData';

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
    // validate userId
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    // validate organization id
    if (!dto.organizationId || !Types.ObjectId.isValid(dto.organizationId)) {
      throw new BadRequestException('Invalid organization ID');
    }
    if (file) {
      const result = await uploadToCloudinary(file);
      dto.image = result.secure_url;
    }


    // ensure organization exists
    const organization = await this.organizationModel.findById(dto.organizationId);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // check duplicate team name within organization
    const existingTeam = await this.teamModel.findOne({
      name: dto.name,
      organization: organization._id,
    });
    if (existingTeam) {
      throw new BadRequestException(`Team with name ${dto.name} already exists`);
    }

    // check user membership or ownership
    const isUserMemberOfOrg = await this.organizationMemberModel.exists({
      organizationId: organization._id,
      userId: new Types.ObjectId(userId),
    });

    const isOrgOwner = String(organization.ownerId) === String(userId);

    if (!isUserMemberOfOrg && !isOrgOwner) {
      throw new BadRequestException('User is not a member of the specified organization');
    }

    if(file){
      const result = await uploadToCloudinary(file);
      dto.image = result.secure_url;
    }

    // create team
    const team = await this.teamModel.create({
      name: dto.name,
      description: dto.description,
      organizationId: organization._id,
      image: dto.image,
    });

    // add creator as admin member of the team
    await this.teamMemberModel.create({
      userId: new Types.ObjectId(userId),
      teamId: team._id,
      role: 'admin',
    });

    return {
      message: 'Team created successfully',
      statusCode: 201,
      data: team,
    };
  }


  async getTeamsByOrganizationId( userId: string) {
 
     if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
     }

     let orgOwnerOrMember = await this.organizationModel.findOne({ ownerId: userId });
     if(!orgOwnerOrMember){
       const orgMember = await this.organizationMemberModel.findOne({userId:new Types.ObjectId(userId)})

       if(orgMember){
        orgOwnerOrMember = await this.organizationModel.findById(orgMember.organizationId);
     }}

     if(!orgOwnerOrMember){
      throw new NotFoundException('Organization not found');
     }

     const teams = await this.teamModel.find({
      organizationId: orgOwnerOrMember._id,
     }).sort({createdAt:-1})
     .lean()
     .select('-__v');

     if(teams.length === 0){
      throw new NotFoundException('No teams found');
     }

     return {
      message: 'Teams fetched successfully',
      statusCode: HttpStatus.OK,
      data: teams,
     };
  }
  

  async updateOrganizationTeamById(id:string,userId:string,dto:UpdateTeamDto,file?:Express.Multer.File){
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid team id');
    }
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const team = await this.teamModel.findById(id);
    if (!team) {
      throw new NotFoundException('Team not found');
    }

    const organization = await this.organizationModel.findOne({
      _id: team.organizationId,
      ownerId: userId,
    });

    if (!organization) {
      throw new ForbiddenException('Only organization owner can update this team');
    }

    if (file) {
      const result = await uploadToCloudinary(file);
      dto.image = result.secure_url;
    }

    const updateTeam = await this.teamModel.findByIdAndUpdate(
      id,
      {
        ...dto,
        ...(dto.image && { image: dto.image }),
      },
      { new: true },
    )
    .lean()
    .select('-__v');

    return {
      message: 'Team updated successfully',
      statusCode: HttpStatus.OK,
      data: updateTeam,
    };
  }


  async deleteOrganizationTeamById(id:string,userId:string){
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid team id');
    }
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }
    const team = await this.teamModel.findById(id);
    if (!team) {
      throw new NotFoundException('Team not found');
    }

    const organization = await this.organizationModel.findOne({
      _id: team.organizationId,
      ownerId: userId,
    });
    if (!organization) {
      throw new ForbiddenException('Only organization owner can delete this team');
    }

    await this.teamModel.findByIdAndDelete(id);
    return {
      message: 'Team deleted successfully',
      statusCode: HttpStatus.OK,
    };
  }

  async addTeamMember(teamId: string, userId: string, dto: AddTeamMemberDto) {
    if (!Types.ObjectId.isValid(teamId)) {
      throw new BadRequestException('Invalid team id');
    }
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const team = await this.teamModel.findById(teamId);
    if (!team) {
      throw new NotFoundException('Team not found');
    }

    const organization = await this.organizationModel.findById(team.organizationId);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const isOrgOwner = String(organization.ownerId) === String(userId);
    const isTeamAdmin = await this.teamMemberModel.exists({
      teamId: team._id,
      userId: new Types.ObjectId(userId),
      role: 'admin',
    });

    if (!isOrgOwner && !isTeamAdmin) {
      throw new ForbiddenException(
        'Only organization owner or team admin can add members',
      );
    }

    const userToAdd = await this.userModel.findOne({ email: dto.email });
    if (!userToAdd) {
      throw new NotFoundException('User not found with this email');
    }

    const isUserOrgOwner = String(organization.ownerId) === String(userToAdd._id);
    const isUserOrgMember = await this.organizationMemberModel.exists({
      organizationId: organization._id,
      userId: userToAdd._id,
    });

    if (!isUserOrgOwner && !isUserOrgMember) {
      await this.organizationMemberModel.create({
        organizationId: organization._id,
        userId: userToAdd._id,
        role: OrgRole.MEMBER,
      });
    }

    const existingMember = await this.teamMemberModel.exists({
      teamId: team._id,
      userId: userToAdd._id,
    });

    if (existingMember) {
      throw new ConflictException('User is already a member of this team');
    }

    const teamMember = await this.teamMemberModel.create({
      userId: userToAdd._id,
      teamId: team._id,
      role: dto.role ?? TeamRole.MEMBER,
    });

    return {
      message: 'Team member added successfully',
      statusCode: HttpStatus.CREATED,
      data: teamMember,
    };
  }
}

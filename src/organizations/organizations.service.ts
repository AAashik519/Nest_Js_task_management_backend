import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Organization } from './schemas/organization.schema';
import { Model, Types } from 'mongoose';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from './dto/organization.dto';
import { uploadToCloudinary } from 'src/utils/cloudinary/cloudinary.utils';
import { OrganizationMember } from './schemas/organization-member.schema';
import { OrgRole } from 'src/utils/EmunsData';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<Organization>,

    @InjectModel(OrganizationMember.name)
    private organizationMemberModel: Model<OrganizationMember>,
  ) {}

  async createOrganization(
    dto: CreateOrganizationDto,
    userId: string,
    file?: Express.Multer.File,
  ) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const existingOrgNameByUser = await this.organizationModel.findOne({
      name: dto.name,
      ownerId: userId,
    });

    if (existingOrgNameByUser) {
      throw new ConflictException(
        `Organization with ${dto.name} already Taken`,
      );
    }

    // const existingOrgByUser= await this.organizationModel.findOne({ownerId: userId})

    // if(existingOrgByUser){
    //   throw new ConflictException(`You already have an organization, you can't create another one` )
    // }

    if (file) {
      const result = await uploadToCloudinary(file);
      dto.image = result.secure_url;
    }

    const organization = await this.organizationModel.create({
      ...dto,
      ownerId: userId,
    });

    await this.organizationMemberModel.create({
      userId: new Types.ObjectId(userId),
      organizationId: organization._id,
      role: OrgRole.OWNER,
    });

    return {
      message: 'Organization created successfully',
      statusCode: HttpStatus.CREATED,
      data: organization,
    };

    // return await organization.save();
  }

  async getOwnerOrganization(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const userOrg = await this.organizationModel
      .find({ ownerId: userId })
      .sort({ createdAt: -1 })
      .lean()
      .select('-__v');

    if (userOrg.length === 0) {
      throw new NotFoundException('Organization not found for this owner');
    }

    return {
      message: 'Organizations fetched successfully',
      statusCode: HttpStatus.OK,
      data: userOrg,
    };
  }

  async updateOrganization(
    id: string,
    userId: string,
    dto: UpdateOrganizationDto,
    file?: Express.Multer.File,
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid organization ID');
    }
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const organization = await this.organizationModel.findOne({
      _id: id,
      ownerId: userId,
    });

    if (!organization) {
      throw new NotFoundException(
        'Organization not found or you are not the owner',
      );
    }

    if (file) {
      const result = await uploadToCloudinary(file);
      dto.image = result.secure_url;
    }

    const updateData = {
      ...dto,
      ...(dto.image && { image: dto.image }),
    };

    Object.assign(organization, updateData);
    await organization.save();

    return {
      message: 'Organization updated successfully',
      statusCode: HttpStatus.OK,
      data: organization,
    };
  }

  async deleteOrganization(id: string, userId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid organization ID');
    }
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }
    const orgMember = await this.organizationMemberModel.findOne({
      organizationId: id,
      userId: userId,
    });

    if (!orgMember) {
      throw new NotFoundException(
        'Organization not found or you are not a member',
      );
    }

    const organization = await this.organizationModel.findOneAndDelete({
      _id: id,
      ownerId: userId,
    });

    // console.log(organization);

    if (!organization) {
      throw new NotFoundException(
        'Organization not found or you are not the owner',
      );
    }

    return {
      message: 'Organization deleted successfully',
      statusCode: HttpStatus.OK,
    };
  }

  async getOrganizationAllMembers(id: string, userId: string) {
    
  }

}

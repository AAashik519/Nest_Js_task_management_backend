import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Organization } from './schemas/organization.schema';
import { Model, Types } from 'mongoose';
import { CreateOrganizationDto } from './dto/organization.dto';
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
    console.log(userId);

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
      })

      return {
        message: 'Organization created successfully',
        statusCode: HttpStatus.CREATED,
        data: organization,
      }

    // return await organization.save();
  }
}

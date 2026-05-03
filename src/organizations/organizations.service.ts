import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Organization } from './schemas/organization.schema';
import { Model } from 'mongoose';
import { CreateOrganizationDto } from './dto/organization.dto';
import { uploadToCloudinary } from 'src/utils/cloudinary/cloudinary.utils';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<Organization>,
  ) {}

  async createOrganization(dto: CreateOrganizationDto, userId: string, file?: Express.Multer.File) {
    console.log(userId);

    const existingOrg = await this.organizationModel.findOne({ name: dto.name, ownerId: userId });
    if (existingOrg) {
      throw new BadRequestException('Organization with the same name already exists for this user');
    }
    if (file) {
      const result = await uploadToCloudinary(file);
      dto.image = result.secure_url;
    }

    const organization = new this.organizationModel({
      ...dto,
      ownerId: userId,
    });

    return await organization.save();
  }
}

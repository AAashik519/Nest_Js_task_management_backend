import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreatreUserDto } from './dto/user-dto';
import cloudinary from 'src/config/cloudinary.config';
import { uploadToCloudinary } from 'src/utils/cloudinary/cloudinary.utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    const existinguser = await this.userModel.findOne({ email });

    if (existinguser) {
      throw new BadRequestException('Email is already exists');
    }

    const hashPassword = await bcrypt.hash(password, 10);
    console.log(hashPassword);

    const user = await this.userModel.create({
      email,
      password: hashPassword,
    });

    const { password: _, ...result } = user.toObject();

    return {
      message: 'User created successfully',
      user: result,
    };
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException('User is not Found');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    // console.log(user);

    if (!isMatch) {
      throw new BadRequestException('Invalid Credentials');
    }

    const payload = {
      sub: user._id,
      email: user.email,
    };

    const token = this.jwtService.sign(payload);

    return {
      message: 'Login Successfully',
      access_token: token,
    };
  }

  async getProfile(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .select('-password')
      .lean();

    if (!user) {
      throw new BadRequestException('User is not Found');
    }
    return {
      message: 'User Profile fetch Successfully',
      user: user,
    };
  }

  async updateProfile(userId: string, dto: CreatreUserDto, file?: Express.Multer.File) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User Not found');
    }

    if (file) {
      const result = await uploadToCloudinary(file)
      dto.image = result.secure_url;
    }
    
    const { password, ...updateData } = dto;
    

    Object.assign(user, updateData);
    await user.save();

    const { password: _, ...result } = user.toObject();

    return {
      message: 'Profile update Successfully',
      user:result,
    };
  }
    
 
}

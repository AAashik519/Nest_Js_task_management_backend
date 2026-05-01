import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import cloudinary from 'src/config/cloudinary.config';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {

@Post('image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload an image to Cloudinary' })
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully',
    schema: {
      example: {
        message: 'Image uploaded successfully',
        url: 'https://cloudinary.com/image-url.jpg',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'No file uploaded' })
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if(!file?.path){
        throw new BadRequestException('No file uploaded');
    }
    const result = await cloudinary.uploader.upload(file.path, {
        folder: 'task-manager',
    });

    return {  
        message: 'Image uploaded successfully',              
        url: result.secure_url,
    }
  }

}
import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import cloudinary from 'src/config/cloudinary.config';

@Controller('upload')
export class UploadController {

@Post('image')
@UseInterceptors(FileInterceptor('file'))
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
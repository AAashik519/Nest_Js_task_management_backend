import cloudinary from 'src/config/cloudinary.config';
import { Readable } from 'stream';

export function uploadToCloudinary(file: Express.Multer.File): Promise<any> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'task-manager',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );
    Readable.from(file.buffer).pipe(uploadStream);
  });
}

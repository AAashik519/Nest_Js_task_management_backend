import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from 'src/config/cloudinary.config';

export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    return {
      folder: 'task-manager',
      format: file.mimetype.split('/')[1], // jpg/png fix
      public_id: file.originalname.split('.')[0],
    };
  },
});
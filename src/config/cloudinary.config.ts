import 'dotenv/config';
import { v2 as cloudinaryLib } from 'cloudinary';

const { CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET } = process.env;

if (!CLOUD_NAME || !CLOUD_API_KEY || !CLOUD_API_SECRET) {
  throw new Error(
    'Missing Cloudinary env vars: CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET',
  );
}

cloudinaryLib.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_API_SECRET,
});

export default cloudinaryLib;
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { config } from './env';

// Configure Cloudinary
if (config.cloudinary.url) {
  cloudinary.config({
    cloudinary_url: config.cloudinary.url,
  });
} else if (
  config.cloudinary.cloudName &&
  config.cloudinary.apiKey &&
  config.cloudinary.apiSecret
) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
    secure: true,
  });
}

/**
 * Returns true if Cloudinary credentials are fully configured
 */
export const isCloudinaryConfigured = (): boolean => {
  return Boolean(
    config.cloudinary.url ||
      (config.cloudinary.cloudName &&
        config.cloudinary.apiKey &&
        config.cloudinary.apiSecret)
  );
};

/**
 * Uploads a buffer directly to Cloudinary using upload_stream
 */
export const uploadBufferToCloudinary = (
  buffer: Buffer,
  folder: string = 'wanderly/tours'
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    if (!isCloudinaryConfigured()) {
      return reject(
        new Error(
          'Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in backend/.env'
        )
      );
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error('Upload to Cloudinary failed'));
        }
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};

export default cloudinary;

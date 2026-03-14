import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

// Helper function to upload image
export const uploadImage = async (file: File, folder: string = 'stm-events'): Promise<any> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default');
    formData.append('folder', folder);

    fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        reject(data.error);
      } else {
        resolve(data);
      }
    })
    .catch(error => {
      reject(error);
    });
  });
};

// Helper function to delete image
export const deleteImage = async (publicId: string): Promise<any> => {
  return cloudinary.uploader.destroy(publicId);
};

// Helper function to get optimized image URL
export const getOptimizedImageUrl = (publicId: string, options: any = {}) => {
  return cloudinary.url(publicId, {
    fetch_format: 'auto',
    quality: 'auto',
    ...options,
  });
};

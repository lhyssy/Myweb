import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

class UploadService {
    async uploadImage(file, folder = 'general') {
        try {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: `personal-website/${folder}`,
                allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
                transformation: [
                    { width: 1000, crop: "limit" },
                    { quality: "auto" },
                    { fetch_format: "auto" }
                ]
            });

            return {
                url: result.secure_url,
                publicId: result.public_id
            };
        } catch (error) {
            console.error('文件上传错误:', error);
            throw new Error('文件上传失败');
        }
    }

    async deleteImage(publicId) {
        try {
            await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.error('文件删除错误:', error);
            throw new Error('文件删除失败');
        }
    }

    async uploadAvatar(file) {
        try {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'personal-website/avatars',
                allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
                transformation: [
                    { width: 400, height: 400, crop: "fill", gravity: "face" },
                    { quality: "auto" },
                    { fetch_format: "auto" }
                ]
            });

            return {
                url: result.secure_url,
                publicId: result.public_id
            };
        } catch (error) {
            console.error('头像上传错误:', error);
            throw new Error('头像上传失败');
        }
    }

    async uploadCoverImage(file) {
        try {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'personal-website/covers',
                allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
                transformation: [
                    { width: 1920, height: 400, crop: "fill" },
                    { quality: "auto" },
                    { fetch_format: "auto" }
                ]
            });

            return {
                url: result.secure_url,
                publicId: result.public_id
            };
        } catch (error) {
            console.error('封面图片上传错误:', error);
            throw new Error('封面图片上传失败');
        }
    }
}

export default new UploadService(); 
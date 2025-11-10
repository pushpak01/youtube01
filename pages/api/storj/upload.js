// pages/api/storj/upload.js - FIXED VERSION
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { createHash } from 'crypto';
import multer from 'multer';
import { promisify } from 'util';

// Initialize Storj S3 client
const s3Client = new S3Client({
  endpoint: process.env.STORJ_ENDPOINT,
  region: 'auto',
  credentials: {
    accessKeyId: process.env.STORJ_ACCESS_KEY,
    secretAccessKey: process.env.STORJ_SECRET_KEY,
  },
  forcePathStyle: true,
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'), false);
    }
  }
});

// Convert callback-based multer to promise-based
const multerUpload = promisify(upload.single('profileImage'));

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Use multer to parse form data
    await multerUpload(req, res);

    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const file = req.file;

    console.log('📁 File upload details:', {
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      bufferLength: file.buffer.length
    });

    // Generate unique filename
    const fileHash = createHash('md5').update(file.buffer).digest('hex');
    const fileExtension = file.originalname.split('.').pop() || 'jpg';
    const filename = `profile-pictures/${fileHash}.${fileExtension}`;

    // Upload to Storj
    const uploadParams = {
      Bucket: process.env.STORJ_BUCKET,
      Key: filename,
      Body: file.buffer,
      ContentType: file.mimetype,
      Metadata: {
        'original-name': file.originalname,
        'uploaded-by': 'sonic-youtube',
        'uploaded-at': new Date().toISOString(),
      }
    };

    console.log('⏳ Uploading to Storj...');
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    const fileUrl = `storj://${process.env.STORJ_BUCKET}/${filename}`;

    console.log('✅ File uploaded successfully:', fileUrl);

    return res.status(200).json({
      success: true,
      fileUrl,
      filename,
      size: file.buffer.length,
      mimeType: file.mimetype
    });

  } catch (error) {
    console.error('❌ Image upload error:', error);

    if (error.message.includes('Invalid file type')) {
      return res.status(400).json({ error: error.message });
    }

    if (error.message.includes('File too large')) {
      return res.status(400).json({ error: 'File too large (max 5MB)' });
    }

    return res.status(500).json({ error: 'Failed to upload image: ' + error.message });
  }
}

// Disable Next.js body parser for this route
export const config = {
  api: {
    bodyParser: false,
  },
};
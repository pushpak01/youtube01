// pages/api/storj/upload-json.js
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { createHash } from 'crypto';

// Initialize Storj S3 client
const s3Client = new S3Client({
  endpoint: process.env.STORJ_ENDPOINT,
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.STORJ_ACCESS_KEY,
    secretAccessKey: process.env.STORJ_SECRET_KEY,
  },
  forcePathStyle: true,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { filename, data } = req.body;

    // Validate required fields
    if (!filename || !data) {
      return res.status(400).json({
        error: 'Filename and data are required'
      });
    }

    // Validate filename format
    if (!filename.startsWith('profiles/') || !filename.endsWith('.json')) {
      return res.status(400).json({
        error: 'Filename must be in format: profiles/{walletAddress}/profile.json'
      });
    }

    console.log('📁 JSON upload details:', {
      filename,
      dataType: typeof data,
      dataKeys: Object.keys(data)
    });

    // Convert data to JSON string with proper formatting
    const jsonData = JSON.stringify(data, null, 2);
    const buffer = Buffer.from(jsonData, 'utf8');

    // Validate JSON size (1MB max for profile data)
    if (buffer.length > 1024 * 1024) {
      return res.status(400).json({
        error: 'Profile data too large (max 1MB)'
      });
    }

    // Create hash for data integrity verification
    const dataHash = createHash('sha256').update(jsonData).digest('hex');

    // Upload to Storj
    const uploadParams = {
      Bucket: process.env.STORJ_BUCKET,
      Key: filename,
      Body: buffer,
      ContentType: 'application/json',
      ContentEncoding: 'utf-8',
      Metadata: {
        'data-hash': dataHash,
        'created-by': 'sonic-youtube',
        'created-at': new Date().toISOString(),
        'data-type': 'user-profile',
        'version': '1.0'
      }
    };

    console.log('⏳ Uploading JSON to Storj...', {
      bucket: process.env.STORJ_BUCKET,
      key: filename,
      size: buffer.length
    });

    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    const fileUrl = `storj://${process.env.STORJ_BUCKET}/${filename}`;

    console.log('✅ JSON uploaded successfully:', fileUrl);

    return res.status(200).json({
      success: true,
      fileUrl,
      filename,
      size: buffer.length,
      dataHash,
      uploadedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ JSON upload error:', error);

    // Handle specific AWS/S3 errors
    if (error.name === 'NoSuchBucket') {
      return res.status(500).json({
        error: 'Storj bucket not found. Please check your bucket configuration.'
      });
    }

    if (error.name === 'InvalidAccessKeyId') {
      return res.status(500).json({
        error: 'Invalid Storj access credentials.'
      });
    }

    if (error.name === 'AccessDenied') {
      return res.status(500).json({
        error: 'Access denied to Storj bucket.'
      });
    }

    return res.status(500).json({
      error: 'Failed to upload JSON data: ' + error.message
    });
  }
}

// Enable Next.js body parser for JSON data (this route expects JSON, not form data)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};
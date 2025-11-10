// pages/api/storj/download.js
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  endpoint: "https://gateway.storjshare.io",
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.STORJ_ACCESS_KEY,
    secretAccessKey: process.env.STORJ_SECRET_KEY,
  },
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { file } = req.query;

    if (!file) {
      return res.status(400).json({ error: 'File parameter is required' });
    }

    console.log('📥 Downloading from Storj:', file);

    // The file parameter should already include the full path without bucket name
    const key = file;
    const bucket = 'sonic-profile';

    console.log('🔍 Storj download details:', { bucket, key });

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    try {
      const response = await s3Client.send(command);

      // Check if it's an image or JSON based on file extension
      const isImage = key.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i);
      const isJson = key.match(/\.json$/i);

      if (isImage) {
        console.log('🖼️ Handling image file');
        // For images, return the image data directly
        const arrayBuffer = await response.Body.transformToByteArray();
        const buffer = Buffer.from(arrayBuffer);

        // Set appropriate content type
        const contentType = response.ContentType || 'image/png';

        console.log('✅ Image downloaded successfully:', {
          key,
          size: buffer.length,
          contentType
        });

        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
        return res.status(200).send(buffer);
      }
      else if (isJson) {
        console.log('📄 Handling JSON file');
        // For JSON files, parse and return as JSON
        const body = await response.Body.transformToString();
        const data = JSON.parse(body);

        console.log('✅ JSON file downloaded successfully:', {
          key,
          size: body.length,
          dataKeys: Object.keys(data)
        });

        return res.status(200).json(data);
      }
      else {
        // For other file types, return as binary
        console.log('📦 Handling binary file');
        const arrayBuffer = await response.Body.transformToByteArray();
        const buffer = Buffer.from(arrayBuffer);

        const contentType = response.ContentType || 'application/octet-stream';

        console.log('✅ File downloaded successfully:', {
          key,
          size: buffer.length,
          contentType
        });

        res.setHeader('Content-Type', contentType);
        return res.status(200).send(buffer);
      }
    } catch (error) {
      console.error('❌ Storj download error:', error);

      if (error.Code === 'NoSuchKey') {
        return res.status(404).json({
          error: 'File not found on Storj',
          details: `Key: ${key}, Bucket: ${bucket}`
        });
      }

      return res.status(500).json({
        error: 'Failed to download file from Storj',
        details: error.message
      });
    }

  } catch (error) {
    console.error('❌ Download API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
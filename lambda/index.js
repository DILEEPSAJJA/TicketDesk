const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const Jimp = require('jimp');

const s3 = new S3Client({});

exports.handler = async (event) => {
    console.log("Received S3 event:", JSON.stringify(event, null, 2));

    for (const record of event.Records) {
        const bucket = record.s3.bucket.name;
        const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));

        // Only process objects in uploads/ prefix to prevent recursive loops
        if (!key.startsWith('uploads/')) {
            console.log(`Skipping object ${key} as it is not in uploads/ directory.`);
            continue;
        }

        const thumbnailKey = key.replace('uploads/', 'thumbnails/');

        try {
            console.log(`Fetching image from ${bucket}/${key}...`);
            const getObjectParams = { Bucket: bucket, Key: key };
            const getResponse = await s3.send(new GetObjectCommand(getObjectParams));
            
            // Read image into buffer
            const streamToBuffer = (stream) =>
                new Promise((resolve, reject) => {
                    const chunks = [];
                    stream.on('data', (chunk) => chunks.push(chunk));
                    stream.on('error', reject);
                    stream.on('end', () => resolve(Buffer.concat(chunks)));
                });

            const imageBuffer = await streamToBuffer(getResponse.Body);

            console.log("Resizing image using Jimp...");
            const image = await Jimp.read(imageBuffer);
            const resizedBuffer = await image
                .resize(150, Jimp.AUTO)
                .quality(80)
                .getBufferAsync(Jimp.MIME_JPEG);

            console.log(`Uploading thumbnail to ${bucket}/${thumbnailKey}...`);
            await s3.send(new PutObjectCommand({
                Bucket: bucket,
                Key: thumbnailKey,
                Body: resizedBuffer,
                ContentType: 'image/jpeg'
            }));

            console.log(`Successfully generated thumbnail: ${thumbnailKey}`);
        } catch (error) {
            console.error(`Error generating thumbnail for ${key}:`, error);
            throw error;
        }
    }
};

require("dotenv").config();
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

AWS.config.update({
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.PRIVATEACCESS_KEY,
    region: process.env.REGION
});

const s3 = new AWS.S3();

const s3Upload = async (folderName = 'metadata', name = `${uuidv4()}.json`, buffer, ContentType) => {
    if (!buffer) {
        throw new Error('File Body is Required');
    }

    const key = `${folderName}/${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}_${name}`;
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: ContentType,
        ACL: 'public-read'
    };

    try {
        const data = await s3.upload(params).promise();
        console.log(`File uploaded successfully. URL: ${data.Location}`);
        return data;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};

module.exports = { s3Upload };

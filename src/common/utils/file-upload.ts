import * as AWS from 'aws-sdk';
import { AwsConfig } from '../../config/aws.config';
const fs = require('fs');
const s3 = new AWS.S3({
  accessKeyId: AwsConfig.accessKeyId,
  secretAccessKey: AwsConfig.secretAccessKey,
  region: AwsConfig.region,
});

export const uploadFile = async (file) => {
  const { originalname } = file;
  const s3Response = await s3_upload(file.buffer, originalname, file.mimetype);
  return s3Response.Location;
};

const s3_upload = async (file, name, mimetype) => {
  const params = {
    Bucket: AwsConfig.bucket,
    Key: String(name),
    Body: file,
    ACL: AwsConfig.acl,
    ContentType: mimetype,
    ContentDisposition: 'inline',
    CreateBucketConfiguration: {
      LocationConstraint: 'ap-south-1',
    },
  };
  try {
    const s3Response = await s3.upload(params).promise();
    return s3Response;
  } catch (e) {
    console.log(e);
  }
};
//const filename = '0433-2-scaled.jpg';

export const uploadImagesScript = async (filename) => {
  console.log(__dirname);
  const fileContent = fs.readFileSync('./images/' + filename);

  const params = {
    Bucket: AwsConfig.bucket,
    Key: filename,
    Body: fileContent,
    ACL: AwsConfig.acl,
    ContentDisposition: 'inline',
    CreateBucketConfiguration: {
      LocationConstraint: 'ap-south-1',
    },
  };
  try {
    const s = await s3.upload(params).promise();
    return s.Location;
  } catch (e) {
    console.log(e);
  }
};

export const uploadFilesScript = async (filename) => {
  console.log(__dirname);
  const fileContent = fs.readFileSync('./files/' + filename);

  const params = {
    Bucket: AwsConfig.bucket,
    Key: filename,
    Body: fileContent,
    ACL: AwsConfig.acl,
    ContentDisposition: 'inline',
    CreateBucketConfiguration: {
      LocationConstraint: 'ap-south-1',
    },
  };
  try {
    const s = await s3.upload(params).promise();
    return s.Location;
  } catch (e) {
    console.log(e);
  }
};

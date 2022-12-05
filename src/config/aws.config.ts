import * as config from 'config';

const AWS_CONFIG = config.get('AWS');

export const AwsConfig = {
  secretAccessKey: AWS_CONFIG.SECRET_ACCESS_KEY,
  accessKeyId: AWS_CONFIG.ACCESS_KEY_ID,
  region: AWS_CONFIG.REGION,
  bucket: AWS_CONFIG.BUCKET_NAME,
  acl: AWS_CONFIG.ACL,
};

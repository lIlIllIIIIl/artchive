import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const R2_BUCKET = process.env.R2_BUCKET ?? 'twtr-v2';

const S3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT ?? 'https://c455543b24af063e26bcccb87edc01db.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  },
});

export function signR2Key(key: string) {
  return getSignedUrl(S3, new GetObjectCommand({ Bucket: R2_BUCKET, Key: key }), { expiresIn: 3600 });
}

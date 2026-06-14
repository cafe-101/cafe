import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { S3Client, HeadBucketCommand, CreateBucketCommand, PutBucketPolicyCommand } from '@aws-sdk/client-s3'

declare module 'fastify' {
  interface FastifyInstance {
    s3: S3Client
  }
}

/**
 * Fastify plugin for integrating AWS S3 using LocalStack configuration.
 * Decorates the fastify instance with an s3 client.
 * @param {FastifyInstance} fastify - The fastify instance.
 * @param {object} opts - Plugin options.
 */
const s3Plugin: FastifyPluginAsync = async (fastify, opts) => {
  const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test',
    },
    endpoint: process.env.AWS_S3_ENDPOINT || 'http://127.0.0.1:4046',
    forcePathStyle: true, // Required for LocalStack
  })

  // Ensure default bucket exists for uploads
  const defaultBucket = process.env.AWS_S3_BUCKET || 'cafe-uploads'
  try {
    try {
      await s3Client.send(new HeadBucketCommand({ Bucket: defaultBucket }))
    } catch (error: any) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        // Bucket does not exist, create it
        await s3Client.send(new CreateBucketCommand({ Bucket: defaultBucket }))
        
        // Set bucket policy for public read (since we'll serve images)
        if (process.env.NODE_ENV !== 'production' || process.env.ALLOW_PUBLIC_BUCKET === 'true') {
          const policy = {
            Version: '2012-10-17',
            Statement: [
              {
                Action: ['s3:GetObject'],
                Effect: 'Allow',
                Principal: '*',
                Resource: [`arn:aws:s3:::${defaultBucket}/*`]
              }
            ]
          }
          await s3Client.send(new PutBucketPolicyCommand({ 
            Bucket: defaultBucket, 
            Policy: JSON.stringify(policy) 
          }))
        }
      } else {
        throw error
      }
    }
  } catch (error) {
    fastify.log.error(error, 'LocalStack S3 Bucket Initialization Failed')
    throw error
  }

  if (!fastify.hasDecorator('s3')) {
    fastify.decorate('s3', s3Client)
  }
}

export default fp(s3Plugin, {
  name: 's3'
})

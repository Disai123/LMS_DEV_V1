const AWS = require('aws-sdk');

class S3Service {
  constructor() {
    // Configure AWS with credentials if available in environment, otherwise it uses IAM if on EC2/ECS
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'ap-south-1'
    });
    this.bucketName = process.env.AWS_S3_BUCKET_NAME || 'gnanamai-lms-realtime-projects';
    console.log(`S3Service initialized with bucket: ${this.bucketName}`);
  }

  /**
   * Helper to normalize keys (ensure no leading slashes)
   */
  normalizeKey(key) {
    return key.replace(/^\/+/, '');
  }

  /**
   * Check if a file exists in S3
   * @param {string} key S3 object key
   * @returns {boolean} True if exists
   */
  async fileExists(key) {
    try {
      await this.s3.headObject({
        Bucket: this.bucketName,
        Key: this.normalizeKey(key)
      }).promise();
      return true;
    } catch (error) {
      if (error.code === 'NotFound' || error.statusCode === 404) {
        return false;
      }
      console.error(`Error checking existence for ${key}:`, error);
      return false;
    }
  }

  /**
   * List all project folders (prefixes) from S3 root
   * Used for discovering projects
   */
  async listProjectFolders() {
    try {
      const params = {
        Bucket: this.bucketName,
        Delimiter: '/' // Only get root level folders
      };

      const data = await this.s3.listObjectsV2(params).promise();
      
      // Extract folder names, removing trailing slashes
      const folders = data.CommonPrefixes.map(prefix => 
        prefix.Prefix.replace(/\/$/, '')
      );
      
      return folders;
    } catch (error) {
      console.error('Error listing project folders from S3:', error);
      return [];
    }
  }

  /**
   * Get contents of a file as a string (useful for JSON, HTML)
   * @param {string} key S3 object key
   */
  async getFileString(key) {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: this.normalizeKey(key)
      };

      const data = await this.s3.getObject(params).promise();
      return data.Body.toString('utf-8');
    } catch (error) {
      if (error.code !== 'NoSuchKey' && error.statusCode !== 404) {
        console.error(`Error reading file ${key} from S3:`, error);
      }
      return null;
    }
  }

  /**
   * Get file stream directly (for images, videos, large files)
   * @param {string} key S3 object key
   * @returns {object} { stream, contentType, contentLength } or null
   */
  async getFileStream(key) {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: this.normalizeKey(key)
      };

      const head = await this.s3.headObject(params).promise();
      
      const stream = this.s3.getObject(params).createReadStream();
      
      return {
        stream,
        contentType: head.ContentType,
        contentLength: head.ContentLength,
        lastModified: head.LastModified
      };
    } catch (error) {
      if (error.code !== 'NotFound' && error.code !== 'NoSuchKey' && error.statusCode !== 404) {
        console.error(`Error getting stream for ${key}:`, error);
      }
      return null;
    }
  }

  /**
   * Get metadata properties like LastModified for a file/folder
   */
  async getObjectMetadata(key) {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: this.normalizeKey(key)
      };
      
      const head = await this.s3.headObject(params).promise();
      return {
        lastModified: head.LastModified,
        contentType: head.ContentType,
        contentLength: head.ContentLength
      };
    } catch (error) {
      return null;
    }
  }
}

module.exports = new S3Service();

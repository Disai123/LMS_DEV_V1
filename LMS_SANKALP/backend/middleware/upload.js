const multer = require('multer');
const path = require('path');
const { validateFileType, validateFileSize } = require('../utils/validation');
const logger = require('../utils/logger');

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter function for documents
const fileFilter = (req, file, cb) => {
  // Check file type
  if (!validateFileType(file.mimetype)) {
    const error = new Error('Invalid file type. Only PDF and DOCX files are allowed.');
    error.code = 'INVALID_FILE_TYPE';
    return cb(error, false);
  }

  // Note: File size validation is handled in validateUploadedFiles middleware
  // since file.size might not be available in the filter

  cb(null, true);
};

// File filter function for images (logos)
const imageFilter = (req, file, cb) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    const error = new Error('Invalid file type. Only image files are allowed for logos.');
    error.code = 'INVALID_FILE_TYPE';
    return cb(error, false);
  }
};

// Multer configuration for documents
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5 // Maximum 5 files per request
  }
});

// Multer configuration for images (logos)
const imageUpload = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB for images
    files: 1 // Maximum 1 logo per request
  }
});

// Single file upload middleware
const uploadSingle = (fieldName = 'file') => {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err) {
        logger.error('File upload error:', err);
        
        if (err.code === 'INVALID_FILE_TYPE') {
          return res.status(400).json({
            success: false,
            message: 'Invalid file type. Only PDF and DOCX files are allowed.'
          });
        }
        
        if (err.code === 'FILE_TOO_LARGE') {
          return res.status(400).json({
            success: false,
            message: 'File too large. Maximum size is 10MB.'
          });
        }
        
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File too large. Maximum size is 10MB.'
          });
        }
        
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({
            success: false,
            message: 'Too many files. Maximum 5 files per request.'
          });
        }
        
        return res.status(400).json({
          success: false,
          message: 'File upload error: ' + err.message
        });
      }
      
      next();
    });
  };
};

// Multiple files upload middleware
const uploadMultiple = (fieldName = 'files', maxCount = 5) => {
  return (req, res, next) => {
    upload.array(fieldName, maxCount)(req, res, (err) => {
      if (err) {
        logger.error('Multiple file upload error:', err);
        
        if (err.code === 'INVALID_FILE_TYPE') {
          return res.status(400).json({
            success: false,
            message: 'Invalid file type. Only PDF and DOCX files are allowed.'
          });
        }
        
        if (err.code === 'FILE_TOO_LARGE') {
          return res.status(400).json({
            success: false,
            message: 'File too large. Maximum size is 10MB.'
          });
        }
        
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File too large. Maximum size is 10MB.'
          });
        }
        
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({
            success: false,
            message: `Too many files. Maximum ${maxCount} files per request.`
          });
        }
        
        return res.status(400).json({
          success: false,
          message: 'File upload error: ' + err.message
        });
      }
      
      next();
    });
  };
};

// Logo upload middleware
const uploadLogo = (fieldName = 'logo') => {
  return (req, res, next) => {
    imageUpload.single(fieldName)(req, res, (err) => {
      if (err) {
        logger.error('Logo upload error:', err);
        
        if (err.code === 'INVALID_FILE_TYPE') {
          return res.status(400).json({
            success: false,
            message: 'Invalid file type. Only image files are allowed for logos.'
          });
        }
        
        if (err.code === 'FILE_TOO_LARGE') {
          return res.status(400).json({
            success: false,
            message: 'File too large. Maximum size is 5MB for logos.'
          });
        }
        
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File too large. Maximum size is 5MB for logos.'
          });
        }
        
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({
            success: false,
            message: 'Only one logo file is allowed per request.'
          });
        }
        
        return res.status(400).json({
          success: false,
          message: 'Logo upload error: ' + err.message
        });
      }
      
      next();
    });
  };
};

// Fields upload middleware (for different file types)
const uploadFields = (fields) => {
  return (req, res, next) => {
    upload.fields(fields)(req, res, (err) => {
      if (err) {
        logger.error('Fields upload error:', err);
        
        if (err.code === 'INVALID_FILE_TYPE') {
          return res.status(400).json({
            success: false,
            message: 'Invalid file type. Only PDF and DOCX files are allowed.'
          });
        }
        
        if (err.code === 'FILE_TOO_LARGE') {
          return res.status(400).json({
            success: false,
            message: 'File too large. Maximum size is 10MB.'
          });
        }
        
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File too large. Maximum size is 10MB.'
          });
        }
        
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({
            success: false,
            message: 'Too many files. Please check the limits.'
          });
        }
        
        return res.status(400).json({
          success: false,
          message: 'File upload error: ' + err.message
        });
      }
      
      next();
    });
  };
};

// Validation middleware for uploaded files
const validateUploadedFiles = (req, res, next) => {
  if (!req.file && (!req.files || req.files.length === 0)) {
    return res.status(400).json({
      success: false,
      message: 'No files uploaded'
    });
  }

  const files = req.files || [req.file];
  const errors = [];

  files.forEach((file, index) => {
    if (!file) return;

    // Validate file type
    if (!validateFileType(file.mimetype)) {
      errors.push(`File ${index + 1}: Invalid file type. Only PDF and DOCX files are allowed.`);
    }

    // Validate file size
    if (!validateFileSize(file.size, 10 * 1024 * 1024)) {
      errors.push(`File ${index + 1}: File too large. Maximum size is 10MB.`);
    }

    // Validate file name
    if (!file.originalname || file.originalname.trim() === '') {
      errors.push(`File ${index + 1}: Invalid file name.`);
    }
  });

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'File validation failed',
      errors: errors
    });
  }

  next();
};

// Middleware to handle file upload errors
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    logger.error('Multer error:', error);
    
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          message: 'File too large. Maximum size is 10MB.'
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          success: false,
          message: 'Too many files. Maximum 5 files per request.'
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          success: false,
          message: 'Unexpected file field.'
        });
      default:
        return res.status(400).json({
          success: false,
          message: 'File upload error: ' + error.message
        });
    }
  }
  
  next(error);
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  uploadLogo,
  uploadFields,
  validateUploadedFiles,
  handleUploadError
};

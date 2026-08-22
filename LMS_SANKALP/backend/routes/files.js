const express = require('express');
const { authenticate, requireEnrollment } = require('../middleware/auth');
const { validate } = require('../utils/validation');
const fileController = require('../controllers/fileController');
const { commonSchemas } = require('../utils/validation');

const router = express.Router();

// File download routes
router.get('/:id/download', 
  authenticate,
  validate(commonSchemas.id, 'params'),
  fileController.downloadFile
);

router.get('/:id/preview', 
  authenticate,
  validate(commonSchemas.id, 'params'),
  fileController.previewFile
);

router.get('/course/:courseId', 
  authenticate,
  requireEnrollment,
  validate(commonSchemas.id, 'params'),
  fileController.getCourseFiles
);

router.get('/:id/info', 
  authenticate,
  validate(commonSchemas.id, 'params'),
  fileController.getFileInfo
);

module.exports = router;

const express = require('express');
const themeController = require('./../controllers/themeController');

const router = express.Router();

router
  .route('/')
  .get(themeController.getAllReviews)  // factory 系列
  .post(
    themeController.uploadThemeImages,
    themeController.resizeThemeImages,
    themeController.createReview      // factory 系列
  );


router
  .route('/:id')
  .get( themeController.getReview)  // factory 系列 get_one
  .patch(
    themeController.uploadThemeImages,
    themeController.resizeThemeImages,
    themeController.updateReview // factory
  )
  .delete(
    themeController.deleteReview  // factory
  );

module.exports = router;



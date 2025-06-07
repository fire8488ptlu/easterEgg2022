const express = require('express');
const contentImgController = require('./../controllers/contentImgController');

const router = express.Router();

router
  .route('/')
  .get(contentImgController.getAllReviews)  // factory 系列
  .post(
    contentImgController.createReview      // factory 系列
  );

router
  .route('/:id')
  .get(contentImgController.getReview)  // factory 系列 get_one
  .patch(
    contentImgController.updateReview // factory
  )
  .delete(
    contentImgController.deleteReview  // factory
  );

module.exports = router;

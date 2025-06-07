const express = require('express');
const coverImgController = require('./../controllers/coverImgController');

const router = express.Router();

router
  .route('/')
  .get(coverImgController.getAllReviews)  // factory 系列
  .post(
    coverImgController.createReview      // factory 系列
  );

router
  .route('/:id')
  .get(coverImgController.getReview)  // factory 系列 get_one
  .patch(
    coverImgController.updateReview // factory
  )
  .delete(
    coverImgController.deleteReview  // factory
  );

module.exports = router;

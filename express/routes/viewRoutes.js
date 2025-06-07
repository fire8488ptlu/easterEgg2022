const express = require('express');
const viewController = require('./../controllers/viewController');

const router = express.Router();

router
  .route('/')
  .get(viewController.getAllReviews)  // factory 系列
  .post(
    viewController.createReview      // factory 系列
  );

router
  .route('/:id')
  .get(viewController.getReview)  // factory 系列 get_one
  .patch(
    viewController.updateReview // factory
  )
  .delete(
    viewController.deleteReview  // factory
  );

module.exports = router;

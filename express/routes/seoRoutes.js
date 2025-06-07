const express = require('express');
const seoController = require('./../controllers/seoController');

const router = express.Router();

// seoAllQuery 只是過濾掉欄位 但沒有作auth 的驗證
// 了解auth.protect 的驗證機制???
// 
router
  .route('/')
  .get(seoController.seoAllQuery , seoController.getAllReviews)  // factory 系列
  .post(
    seoController.createReview      // factory 系列
  );


router
  .route('/:id')
  .get(seoController.seoQuery , seoController.getReview)  // factory 系列 get_one
  .patch(
    seoController.seoQuery,  
    seoController.updateReview // factory
  )
  .delete(
    seoController.deleteReview  // factory
  );

module.exports = router;




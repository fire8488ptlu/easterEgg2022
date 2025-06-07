const express = require('express');
const refreshTokenController = require('./../controllers/refreshTokenController');

const router = express.Router();

// seoAllQuery 只是過濾掉欄位 但沒有作auth 的驗證
// 了解auth.protect 的驗證機制???
// 
router
  .route('/')
  .get( refreshTokenController.getAllReviews)  // factory 系列
  .post(
    refreshTokenController.createReview      // factory 系列
  );


// 感覺只需要這個就好 id 只的是Refresh的ID 
router
  .route('/:id')
  .get(refreshTokenController.getReview)  // factory 系列 get_one
  .patch(
    refreshTokenController.updateReview // factory
  )
  .delete(
    refreshTokenController.deleteReview  // factory
  );

module.exports = router;




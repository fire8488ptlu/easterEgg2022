const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');


// app.use('/api/v1/tours', tourRouter);
// app.use('/api/v1/users', userRouter);
// app.use('/api/v1/reviews', reviewRouter);


// 這段是在做什麼呢?? 從tour routes轉過來 讀取之前的url params
const router = express.Router({ mergeParams: true });

// token login驗證
router.use(authController.protect);


router
  .route('/')
  .get(reviewController.getAllReviews)  // factory 系列
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview      // factory 系列
  );

router
  .route('/:id')
  .get(reviewController.getReview)  // factory 系列 get_one
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview // factory
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview  // factory
  );

module.exports = router;

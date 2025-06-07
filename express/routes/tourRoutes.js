const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

// 先到tourRouets 再轉到 reviewRoutes
router.use('/:tourId/reviews', reviewRouter);

// tourController.aliasTopTours 做middleware 再next() 到 tourController.getAllTours
router
  .route('/top-5-cheap')
  // 先aliasTopTours 設定一下專業用的mongodb 引數，在傳給 getalltours(factory 系列)
  // factory 會讀取 req.query.limit req.query.sort req.query.fields 
  // facotry 主要是讀取req.query 裡面的參數 去給予資料
  .get(tourController.aliasTopTours, tourController.getAllTours);

  // 組合拳系列  這個東西回傳什麼???
router.route('/tour-stats').get(tourController.getTourStats);

// 經過好幾層驗證 token role 最後拿到計畫  這個東西回傳什麼???
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );


// 地理位置查詢----------------應該不會用到-------------
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);



//----------------------------------------------
//getall Model = {{URL}}api/v1/tours?duration[get]=10&sort=price
// getall 裡面有 req.query 會去篩選條件
// 畢竟是多筆資料所以需要有篩選的機制 找單筆的不需要篩選
router
  .route('/')
  // 有點不知道getallTours factory 的原理
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    // factory mongo 引數系列
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    // factory mongo 引數系列
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    // factory mongo 引數系列
    tourController.deleteTour
  );


module.exports = router;

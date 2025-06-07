const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

// app.use('/api/v1/tours', tourRouter);
// app.use('/api/v1/users', userRouter);
// app.use('/api/v1/reviews', reviewRouter);

router.post('/signup', authController.signup); // 
router.post('/login', authController.login);  
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// 除了上面四個以外不需要經過protect 剩下的都要經過
// 不是上面四個指令 也會經過這個 ex: post resetPassword/:token
// Protect all routes after this middleware
router.use(authController.protect);

// 經過protect 的時候 就已經在裡面有了id 所以 update可以直接抓到 
// id 源自於 berar 裡面的token
router.patch('/updateMyPassword', authController.updatePassword);
// 先get me 拿到id 在把id 傳到 factory 的getuser
router.get('/me', userController.getMe, userController.getUser);

// 都沒有進factory
// 這裡不能更新password 因為有做一個防呆 但是 下面的handle factory 可以
router.patch('/updateMe', 
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete('/deleteMe', userController.deleteMe);


// admin 的 updateUser 跟 updateMe 有權限限制 更改的內容也應該要有限
// restrictTo 是custom的function
router.use(authController.restrictTo('admin'));
// 這個原理他是怎麼限制的???
// express 本身是middleware 所有順序都是由上往下 層層進 所以有use
// use helmet use xss 再來 use authController proect 再來就是 restrict to
router
  .route('/')
  // getallusers 有用到factory apiFeatures
  .get(userController.getAllUsers)
  .post(userController.createUser);

  // 以user的id 去做factory 的各種 讀 寫 更新...之類的功能
  // handle factory 可以UpdatePassword 
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;

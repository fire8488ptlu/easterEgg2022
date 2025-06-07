const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const RefreshToken = require('../models/refreshTokenModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

const signToken = id => {
  // jwt 做加密回傳
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};


const signRefreshToken = id =>{
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
  });
}

// cookie 這部分可能要改掉
//發送存在cookie裡面的 token
const createSendToken = async(user, statusCode, res) => {
  const token = signToken(user._id);
  // const refreshToken = signRefreshToken(user._id);


  //cookie 裡面有很多fields
  // domain path expires httponly secure
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  // productrion 模式 cookie裡面的 secire格式是 true
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  // 把做好的資料存在cookie裡面 jwt
  // console.log(token)
  // console.log(cookieOptions)
  // token 的值放在 name 為 jwt 的 value裡面 剩下的欄位都是 cookireOptions 的部分(也可以自訂)
  res.cookie('jwt', token, cookieOptions);
  // 存入token 裡面
  // await RefreshToken.create({token:refreshToken,user:user._id});

  // Remove password from output
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    // refreshToken,
    token,
    data: {
      user
    }
  });
};

//--- 在js裡面，如果function要能夠給外面用就是要有exports出去

// signup 完之後 回傳token 做什麼 應該是之後要跟email 發送的東西串
exports.signup = catchAsync(async (req, res, next) => {
  // 這裡已經把資料送去database
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  // 回傳成功資訊 & token
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
});

// 這個protect 針對是否有token 做驗證 來執行資料的update
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  // 前端會去cookie裡面找token 然後包在headers 裡面 以Bearer Token 送出
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token = req.headers.authorization.split(' ')[1];
  }


  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // 2) Verification token
  // 這個promisify 的風格還是要在熟悉一下
  console.log(token)
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //console.log(decoded) 
  //{ id: '61f4de98142d080028473816', iat: 1643439397, exp: 1651215397 }

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // Token Is Expired  error
  // redux 那端重新發一個 refresh token 請求
  //

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    // 確認user.role到底有沒有admin
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};

// 會寄送email 
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  // 2) Generate the random reset token
  // use the methods createpasswordresetoken in user model return token
  const resetToken = user.createPasswordResetToken();
  // 因為createPassowrdResetToken() 會存放 passwordResetExpires 這個資料欄位
  // 所以validateBeforeSave: false 先關掉審核機制讓他能夠存
  await user.save({ validateBeforeSave: false }); 

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
  
  // sendEmail import from utils/email
  // email,subject,message 打包成 options 傳過去
  try {

    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    // 清空user 裡面的 passwordResetToken passwordResetExpires
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    // 關掉審核機制 密碼undefined 才可以被儲存
    await user.save({ validateBeforeSave: false }); //
    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }


});

exports.resetPassword = catchAsync(async (req, res, next) => {
  console.log(req.params.token)
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    // get url 上面的token 
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
});



exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');
  // 2) Check if POSTed current password is correct
  // 呼叫 user model裡面的 virtual fucntion correctPassword 並且傳遞(兩個parameter)
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }
  // 3) If so, update password
  // 更新mongodb 的資料 最後要save()
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!
  // 4) Log user in, send JWT
  //發新的token 登出後重新操作
  createSendToken(user, 200, res);
});

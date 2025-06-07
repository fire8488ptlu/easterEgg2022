const multer = require('multer'); // 處理檔案的過濾器 檢查是否合格 有storage功能儲存檔案 (但這裡沒有用到)
const sharp = require('sharp'); // 檔案壓縮器  有儲存功能
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

// multer & sharp 到底在做什麼??? 
//---------------------------------------------------------------
const multerStorage = multer.memoryStorage();
// 若接受該檔案：呼叫時帶入 true  cb(null, true)
// 若不接受該檔案：呼叫時帶入 false  cb(null, false)
// 輸出錯誤訊息 cb(new Error('請上傳正確的檔案格式'))
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true); // == next(null,true)
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

// 經過了multer 過濾器 都會有multer api 的key (都是multer 標記上去的)
// fieldname  originalname encoding mimetype size destination filename path buffer
// 接收名為 photo 欄位的單一檔案 (multer 過濾器) 
// 如果不合 會cb() callback AppError() cb() 已經有了next() 的功能
exports.uploadUserPhoto = upload.single('photo');

// sharp() 檔案壓縮器 & 檔案儲存功能 toFile()
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  // 這段有偵測req.file是否存在 
  if (!req.file ) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  // buffer 這裡是image檔案 
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
});

//---------------------------------------------------

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  
  // 如果有photo 就更新 req.file 就會有filename
  if (req.file) filteredBody.photo = req.file.filename;

  // 3) Update user document filteredBody(name,email,photo)
  // 這個跟handle factory 的寫法是一樣的 
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });


  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead'
  });
};

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);

// Do NOT update passwords with this!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

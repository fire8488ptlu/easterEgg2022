const Theme = require('./../models/themeModel');
const factory = require('./handlerFactory');
const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');



const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

// user那邊是用single('photo') 
// 因為這裡是fields 所以可以針對每個欄位去限制
exports.uploadThemeImages = upload.fields([
  { name: 'coverImg', maxCount: 20 },
  { name: 'contentImg', maxCount: 20 }
]);

// upload.single('image') req.file
// upload.array('images', 5) req.files

exports.resizeThemeImages = catchAsync(async (req, res, next) => {

//   console.log(req.files)
  // console.log(req.files)
  if (!req.files.coverImg || !req.files.contentImg) return next();


  req.body.coverImg = [];
  await Promise.all(
    req.files.coverImg.map(async (file, i) => {
      const filename = `themes-${req.params.id}-${Date.now()}-${i + 1}-cover.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/themes/${filename}`);

      req.body.coverImg.push(filename);
    })
  );


  // 2) Images
  req.body.contentImg = [];

  await Promise.all(
    req.files.contentImg.map(async (file, i) => {
      const filename = `themes-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/themes/${filename}`);

      req.body.contentImg.push(filename);
    })
  );

  next();
});

exports.getAllReviews = factory.getAll(Theme);
exports.getReview = factory.getOne(Theme);
exports.createReview = factory.createOne(Theme);
exports.updateReview = factory.updateOne(Theme);
// update 部分要客製一下

// coverimg update
// contentimg update 
// 3 個更新的按鈕?

// Theme.update({'coverImg._id': 2}, {
//     '$set': {
//     'coverImg.$.title': 'updated item2',
//     'coverImg.$.description': 'two updated',
//     'coverImg.$.photo':"fsdfsdf",
// }}, function(err) { ...

exports.deleteReview = factory.deleteOne(Theme);
  


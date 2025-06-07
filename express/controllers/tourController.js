const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');



// 這個是mongodb 專業用parameter 
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// factory 系列 讀取mongodb 參數 給予資料
exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

// 組合拳系列去搜索...之類的索引
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
    // {
    //   $match: { _id: { $ne: 'EASY' } }
    // }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; // 2021

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { numTourStarts: -1 }
    },
    {
      $limit: 12
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan
    }
  });
});

// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/233/center/34.111745,-118.113491/unit/mi
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr and longitude in the format lat,lng.',
        400
      )
    );
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours
    }
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr and longitude in the format lat,lng.',
        400
      )
    );
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances
    }
  });
});















// exports.aliasTopTours = (req, res, next) => {
//   req.query.limit = '5';
//   req.query.sort = '-ratingsAverage,price';
//   req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
//   next();
// };

// // 高階用法直接把catch error這個方法直接透過 另外一個module達成
// exports.getAllTours = catchAsync(async (req, res, next) => {
//   // 技術難度有點高的外包class
//   const features = new APIFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();
//   const tours = await features.query;
//   // SEND RESPONSE
//   res.status(200).json({
//     status: 'success',
//     results: tours.length,
//     data: {
//       tours
//     }
//   });
// });

// exports.getTour = catchAsync(async (req, res, next) => {
//   // model 內建的findById 功能
//   const tour = await Tour.findById(req.params.id);

//   // Tour.findOne({ _id: req.params.id })
//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour
//     }
//   });
// });


// exports.getTour = async(req,res,next)=>{
//   try{
//     const tour = await Tour.findById(req.params.id);
//     res.status(200).json({
//       status: 'success',
//       data: {
//         tour
//       }
//     });
//   }catch(err){
//       console.log("get tour err")
//       next(err)
//   }
// }






// exports.createTour = catchAsync(async (req, res, next) => {
//   const newTour = await Tour.create(req.body);
  
//   res.status(201).json({
//     status: 'success',
//     data: {
//       tour: newTour
//     }
//   });

// });


// 基本的寫法
// exports.createTour = async(req,res,next)=>{
//   try{
//     const newTour = await Tour.create(req.body);
//     res.status(201).json({
//       status:"success",
//       data:{
//         tour:newTour
//       }
//     });
//   }catch(err){
//        next(err)
//   }
// }





// exports.updateTour = catchAsync(async (req, res, next) => {
//   // 這個new & runValidators ???
//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true
//   });

//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour
//     }
//   });
// });

// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);

//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null
//   });
// });

// // aggregate 一個組合拳套裝
// exports.getTourStats = catchAsync(async (req, res, next) => {
//   // $match do the filer
//   // $group 做分類 以_id difficulty 難度去做分類
//   // {match}{group}{sort}{match} 打一個組合拳去實現自己要的資料
//   const stats = await Tour.aggregate([
//     {
//       $match: { ratingsAverage: { $gte: 4.5 } }
//     },
//     {
//       $group: {
//         _id: { $toUpper: '$difficulty' },
//         numTours: { $sum: 1 },
//         numRatings: { $sum: '$ratingsQuantity' },
//         avgRating: { $avg: '$ratingsAverage' },
//         avgPrice: { $avg: '$price' },
//         minPrice: { $min: '$price' },
//         maxPrice: { $max: '$price' }
//       }
//     },
//     {
//       $sort: { avgPrice: 1 }
//     }
//     // {
//     //   $match: { _id: { $ne: 'EASY' } }
//     // }
//   ]);

//   res.status(200).json({
//     status: 'success',
//     data: {
//       stats
//     }
//   });
// });

// exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
//   const year = req.params.year * 1; // 2021
//   // $unwind 把在同一個array[] 的元素獨立出來 
//   const plan = await Tour.aggregate([
    
//     {
//       $unwind: '$startDates'
//     },
//     {
//       $match: {
//         startDates: {
//           $gte: new Date(`${year}-01-01`),
//           $lte: new Date(`${year}-12-31`)
//         }
//       }
//     },
//     {
//       $group: {
//         _id: { $month: '$startDates' },
//         numTourStarts: { $sum: 1 },
//         tours: { $push: '$name' }
//       }
//     },
//     {
//       $addFields: { month: '$_id' }
//     },
//     {
//       $project: {
//         _id: 0
//       }
//     },
//     {
//       $sort: { numTourStarts: -1 }
//     },
//     {
//       $limit: 12
//     }
//   ]);

//   res.status(200).json({
//     status: 'success',
//     data: {
//       plan
//     }
//   });
// });


// $eq  Matches values that are equal to a specified value.
// $gt  Matches values that are greater than a specified value.
// $gte Matches values that are greater than or equal to a specified value.
// $in  Matches any of the values specified in an array.
// $lt  Matches values that are less than a specified value.
// $lte Matches values that are less than or equal to a specified value.
// $ne  Matches all values that are not equal to a specified value.
// $nin Matches none of the values specified in an array.
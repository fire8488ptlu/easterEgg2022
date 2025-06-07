const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');
const { listenerCount } = require('../models/seoModel');


// 導入model 然後去做操作
// Factory 做的就是 moongoose 的 基本 delete update create get_all 等功能變成模板
// Model.findByIdAndDelete through ID
exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    // 
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    // 204 代表成功就不用在更新了
    res.status(204).json({
      status: 'success',
      data: null
    });
  });

 
// Model.findByIdAndUpdate  through ID
exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {

    let doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    if(req.query.removeFields){
      let fields_filter = req.query.removeFields.split(",")
      doc = JSON.stringify(doc)
      doc = JSON.parse(doc)
      for(var i=0;i<fields_filter.length;i++){
        delete doc[fields_filter[i]]
      }
    }
    // let fields_filter = req.query.removeFields.split(",")
    // doc = JSON.stringify(doc)
    // doc = JSON.parse(doc)
    // for(var i=0;i<fields_filter.length;i++){
    //   delete doc[fields_filter[i]]
    // }


    res.status(200).json({
      status: 'success',
      data: doc
      
    });
  });

// Model.create()  through ID
exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: doc
      
    });
  });

// Model.findById  through ID
// 這裡不用APIFeatures因為這樣會耗工耗時 今天之所以這樣設計就是善用findById這個功能
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    // 如果要做popOptions
    //find() returns a cursor, which has a select method. 
    //findOne() retrieves a single document and returns a promise
    //if no callback is provided.
    let query = Model.findById(req.params.id)
    if (popOptions) {
      query = query.populate(popOptions);
    }
    let doc = await query
    // 要先stringify(API featrue也是這樣寫)才能去edit!!!
    // 確定沒有Query fields 要去刪掉
    if(req.query.removeFields){
      let fields_filter = req.query.removeFields.split(",")
      doc = JSON.stringify(doc)
      doc = JSON.parse(doc)
      for(var i=0;i<fields_filter.length;i++){
        delete doc[fields_filter[i]]
      }
    }

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: doc
    });
    
  });

//
exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    //console.log(req.rawHeaders)
    //console.log(req.headers,req._remoteAddress)
    // To allow for nested GET reviews on tour (hack)
    let filter = {};
    // 如果filter 有toureId filter 裡面就會有東西
    if (req.params.tourId) {
      filter = { tour: req.params.tourId };
    }

    // 這個APIFeatures 到底是在做什麼???
    // why find {} 會得到所有????
    // req.query  這個是用來讀取url的parameter  {{URL}}api/v1/tours?duration[get]=10&sort=price
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // doc 就是已經找到的資料 針對query的條件再去篩選
    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: doc
      
    });
  });

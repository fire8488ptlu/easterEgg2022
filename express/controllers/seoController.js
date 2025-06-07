const Seo = require('./../models/seoModel');
const factory = require('./handlerFactory');


// split string to array
exports.splitSeoString = (req, res, next) => {
    next();
}



exports.seoQuery = (req, res, next) => {
    // custom的query
    req.query.removeFields = '__v,_id';
    next();
  };


exports.seoAllQuery = (req, res, next) => {
    // req.query.limit = '5';
    // req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'seoWord,id';
    next();
  };
  
// 用一個query_value 帶到factory 讓 API去過濾


  
exports.getAllReviews = factory.getAll(Seo);
exports.getReview = factory.getOne(Seo);
exports.createReview = factory.createOne(Seo);
exports.updateReview = factory.updateOne(Seo);
exports.deleteReview = factory.deleteOne(Seo);
  



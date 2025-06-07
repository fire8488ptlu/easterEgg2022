const mongoose = require('mongoose');


const contentImgSchema = new mongoose.Schema(
  {
    __v:{
      type:Number,
      select:false
    }
  },
  {
    imageContent: {
        type: String,
        required: [true, 'A tour must have a cover image']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// 不要再controller 的原因是因為會透過factory create所以就在這邊用了
// 對platform 跟  country 進行加工


const content = mongoose.model('Content', contentImgSchema);
module.exports = content;
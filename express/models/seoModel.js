const { query } = require('express');
const mongoose = require('mongoose');


const seoSchema = new mongoose.Schema(
  // 這段沒有+的話default 輸出的欄位會多這個 所以要hide掉
  {
    seoWord: {
      type: String,
      required: [true, 'SEO can not be empty!']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  },

);



// seoSchema.post('save', function() {
//   query.select('seoWord')
//   console.log(this)
//   //console.log(this.constructor.result) //undefined
// });




const seo = mongoose.model('SEO', seoSchema);
module.exports = seo;
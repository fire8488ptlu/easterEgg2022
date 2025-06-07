const mongoose = require('mongoose');
// string 過濾器
const slugify = require('slugify');


// array item find by id test
// postman post multiple file to themeSchema
// & update function 
const themeSchema = new mongoose.Schema(
    {
        title:{
            type:String
        },
        description:{
            type:String
        },
        coverImg:[String],
        contentImg:[String],
        seo:[String],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)

const theme = mongoose.model('Theme', themeSchema);
module.exports = theme;
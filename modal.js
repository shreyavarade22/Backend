//Schema
const mongoose = require ('mongoose')
 
const userSchema = mongoose.Schema({
 SrNo:Number,
 FullName:String,
 Email:String,
 Mobile:Number,
 Gender:String,
//  image:String
})
module.exports = mongoose.model('userdetails' ,userSchema)

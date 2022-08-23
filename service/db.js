//server database intergration

//import mongoose
const mongoose = require('mongoose')

//connect server with mongodb
mongoose.connect('mongodb://localhost:27017/bank',{
    useNewUrlParser:true
})

//create model(collection) 
const Account = mongoose.model('Account',{
    accno:Number,
    accname:String,
    accpwrd:String,
    accbal:Number,
    transaction:[]})

module.exports={
    Account
}
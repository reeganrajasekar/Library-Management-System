const mongoose = require("mongoose")

const schema = mongoose.Schema({
	staff_name: String,
	staff_id:{type:Number,unique:true},
	staff_email:{type:String,unique:true},
	staff_password:String,
	dept:String,
	access:Boolean,
	timestamp: { type: Date, default: Date.now},
})

module.exports = mongoose.model("Staff", schema)
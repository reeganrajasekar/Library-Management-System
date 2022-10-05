const mongoose = require("mongoose")

const schema = mongoose.Schema({
	student_name: String,
	student_id:{type:Number,unique:true},
	student_email:{type:String,unique:true},
	student_password:String,
	dept:String,
	access:Boolean,
	timestamp: { type: Date, default: Date.now},
})

module.exports = mongoose.model("Student", schema)
const mongoose = require("mongoose")

const schema = mongoose.Schema({
	student_name: String,
	student_id:{type:String,unique:true},
	student_email:{type:String,unique:true},
	student_password:String,
	dept:String,
	access:Boolean,
	file:String,
	timestamp: { type: Date, default: Date.now},
})

module.exports = mongoose.model("Student", schema)
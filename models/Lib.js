const mongoose = require("mongoose")

const schema = mongoose.Schema({
	staff_id : Number,
	student_id : Number,
	person_name:String,
	book_id:String,
	book_name:String,
	permit:{type:Boolean,default: false},
	gettime:Date,
	data:String,
	timestamp: { type: Date, default: Date.now},

})

module.exports = mongoose.model("Lib", schema)
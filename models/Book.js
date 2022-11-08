const mongoose = require("mongoose")

const schema = mongoose.Schema({
	book_name: String,
	author_name : String,
	year : Number,
	version : Number,
	ISBN : {type:Number ,unique:true},
	dept : Array,
	stock : Number,
	timestamp: { type: Date, default: Date.now},
})

module.exports = mongoose.model("Book", schema)
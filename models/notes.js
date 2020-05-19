var mongoose=require("mongoose")


var notesSchema = new mongoose.Schema({
	description:String,
	createdAt:{type:Date,default:Date.now},
	author:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
	},
})



module.exports=mongoose.model("Note",notesSchema); 
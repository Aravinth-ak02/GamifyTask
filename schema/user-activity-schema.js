import mongoose from "mongoose";

const userActivitySchema = mongoose.Schema({
    activity_name: String,
    points:{type:Number,default:0},
    username:String,
    user_id:{type:mongoose.Schema.ObjectId,ref:"users"},
    activity_id:{type:mongoose.Schema.ObjectId,ref:"activity"},
    status:{type:Number,default:1}
},{
    timestamps: true,
    versionKey: false
});

export default mongoose.model("userActivity",userActivitySchema,"userActivity")
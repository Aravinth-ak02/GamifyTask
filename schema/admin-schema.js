import mongoose from "mongoose";

const adminSchema = mongoose.Schema({
    username: String,
    password:String,
    status:{type:Number,default:1}
},{
    timestamps: true,
    versionKey: false
});

export default mongoose.model("admin",adminSchema,"admin")
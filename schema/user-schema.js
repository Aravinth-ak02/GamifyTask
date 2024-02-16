import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password:String,
    overall_points:{type:Number,default:0},
    status:{type:Number,default:1}
},{
    timestamps: true,
    versionKey: false
});

export default mongoose.model("users",userSchema,"users")
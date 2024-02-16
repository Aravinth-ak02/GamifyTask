import mongoose from "mongoose";

const activitySchema = mongoose.Schema({
    name: String,
    points:{type:Number,default:0},
    completed_count:{type:Number,default:0},
    status:{type:Number,default:1}
},{
    timestamps: true,
    versionKey: false
});

export default mongoose.model("activity",activitySchema,"activity")
import Users from "../schema/user-schema.js";
import Activity from "../schema/activity-schema.js";
import UserActivity from "../schema/user-activity-schema.js";

export async function checkUserDuplicateMail(req, res, next) {
    const { email } = req.body;
    try {
        let checkmail = await Users.findOne({ email: email });
        if (checkmail) {
            return res.status(400).send({ status: false, message: "Email is already registered" });
        };
        next();
    } catch (error) {
        return res.status(500).send({ status: false, message: "Something went wrong! Please try again" });
    }
};

export async function checkDuplicateActivity(req, res, next) {
    const { name } = req.body;
    try {
        let checkActivity = await Activity.findOne({ name: name });
        if (checkActivity) {
            return res.status(400).send({ status: false, message: "Activity already added! Please try new activity" });
        };
        next();
    } catch (error) {
        return res.status(500).send({ status: false, message: "Something went wrong! Please try again" });
    }
};

export async function checkActivityComplete(req, res, next) {
    const { user_id } = req.data;
    const { activity_id } = req.body
    try {
        let checkActivity = await UserActivity.findOne({ user_id: user_id, activity_id: activity_id });
        if(checkActivity){
            return res.status(404).send({status:false,message:"You already completed this activity"});
        };
        next();
    } catch (error) {
        return res.status(500).send({ status: false, message: "Something went wrong! Please try again" });
    }
}
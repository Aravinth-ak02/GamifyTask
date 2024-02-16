import bcrypt from "bcrypt";
import Users from "../schema/user-schema.js";
import jwt from "jsonwebtoken";
import { CONFIG } from "../config.js";
import moment from "moment";
import UserActivity from "../schema/user-activity-schema.js";
import Activity from "../schema/activity-schema.js";
import mongoose from "mongoose";

export async function userRegister(req, res) {
    const { name, email, password, confirm_password } = req.body;
    try {
        if (password != confirm_password) {
            return res.status(400).send({ status: false, message: "Password and confirm password not matched" });
        };
        let insert_obj = {
            name: name,
            email: email
        };
        let getSalt = await bcrypt.genSaltSync(10);
        insert_obj.password = await bcrypt.hash(password, getSalt);
        await Users.insertMany(insert_obj).then(result => {
            if (result && result.length > 0) {
                let jwt_obj = {
                    name: name,
                    email: email,
                    user_id: result[0]._id
                };
                jwt_obj.token = jwt.sign({ data: jwt_obj }, CONFIG.JWT_SECRET, { expiresIn: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 360) });
                return res.status(200).send({ status: true, message: "User Register Successfully", response: jwt_obj });
            } else {
                return res.status(500).send({ status: false, message: "Something went wrong! Please try again" });
            }
        }).catch((error) => {
            return res.status(500).send({ status: false, message: "Something went wrong! Please try again " });
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: "Something went wrong! Please try again" });
    }
};

export async function userLogin(req, res) {
    const { email, password } = req.body;
    try {
        let findUser = await Users.findOne({ email: email, status: 1 });
        if (findUser) {
            let pass_match = await bcrypt.compare(password, findUser.password);
            if (pass_match) {
                let jwt_obj = {
                    name: findUser.name,
                    email: email,
                    user_id: findUser._id
                };
                jwt_obj.token = jwt.sign({ data: jwt_obj }, CONFIG.JWT_SECRET, { expiresIn: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 360) });
                return res.status(200).send({ status: true, message: "Login successfully", response: jwt_obj });
            } else {
                return res.status(404).send({ status: false, message: "Incorrect Password! Please check and try again" });
            };
        } else {
            return res.status(404).send({ status: false, message: "User not found! Please check the email and try again" });
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: "Something went wrong! Please try again" });
    }
};

export async function leaderboardList(req, res) {
    const { date } = req.body;
    try {
        let skip = req.body.skip ? parseInt(req.body.skip) : 0;
        let limit = req.body.limit ? parseInt(req.body.limit) : 0;
        let condition = { status: 1 };
        if (date && !isNaN(new Date(date))) {
            condition.createdAt = {
                $gte: new Date(moment(date).startOf("M")),
                $lte: new Date(moment(date).endOf("M"))
            }
        } else {
            condition.createdAt = {
                $gte: new Date(moment().startOf("M")),
                $lte: new Date(moment().endOf("M"))
            }
        };
        let activityList = await UserActivity.aggregate([
            {
                $match: condition
            }, {
                $group: {
                    _id: "$user_id",
                    username: { $first: "$username" },
                    user_id: { $first: "$user_id" },
                    points: { $sum: "$points" },
                }
            }, {
                $facet: {
                    document: [
                        {
                            $sort: { points: -1 }
                        }, {
                            $skip: skip
                        }, {
                            $limit: limit
                        }
                    ],
                    count: [
                        { $count: "totalCounts" }
                    ]
                }
            },
        ]);
        let list = activityList[0].document;
        let counts = activityList[0].count;
        return res.status(200).send({ status: true, message: "Activity list found", response: { list: list, totalCounts: (counts && Array.isArray(counts) && counts.length > 0) ? counts[0].totalCounts : 0 } })
    } catch (error) {
        return res.status(500).send({ status: false, message: "Something went wrong! Please try again" });
    }
};

export async function newActivities(req, res) {
    const { user_id } = req.data;
    try {
        let condition = {
            createdAt: {
                $gte: new Date(moment().startOf("M")),
                $lte: new Date(moment().endOf("M"))
            }
        };
        let userActivityList = await UserActivity.find({ ...condition, user_id: user_id }).select(`activity_id`);
        condition["_id"] = { $nin: userActivityList.map(x => x.activity_id) };
        condition.status = 1;
        let skip = req.body.skip ? parseInt(req.body.skip) : 0;
        let limit = req.body.limit ? parseInt(req.body.limit) : 0;
        let activityList = Activity.find(condition).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
        let activityCount = Activity.countDocuments(condition);
        Promise.all([activityList, activityCount]).then(([list, count]) => {
            return res.status(200).send({ status: true, message: "Activitylist found", response: { list: list, totalCounts: count } });
        }).catch(error => {
            return res.status(500).send({ status: false, message: "Something went wrong! Please try again", error: error });

        })
    } catch (error) {
        return res.status(500).send({ status: false, message: "Something went wrong! Please try again" });
    }
};

export async function activityComplete(req, res) {
    const { user_id, username } = req.data;
    const { activity_id } = req.body;
    try {
        if (!mongoose.isValidObjectId(activity_id)) {
            return res.status(400).send({ status: false, message: "Inavlid Activity! Please check and try again" });
        };
        let findActivity = await Activity.findOne({ _id: new mongoose.Types.ObjectId(activity_id) });
        if (findActivity) {
            let activity_obj = {
                user_id: user_id,
                username: username,
                activity_id: findActivity._id,
                activity_name: findActivity.name,
                points: findActivity.points
            };
            let insert_activity = await UserActivity.insertMany(activity_obj);
            if (insert_activity && insert_activity.length > 0) {
                await Activity.updateOne({ _id: findActivity._id }, { $inc: { completed_count: 1 } });
                await Users.updateOne({ _id: user_id }, { $inc: { overall_points: findActivity.points } });
                return res.status(200).send({ status: true, message: "Activity completed successfully" });
            } else {
                return res.status(500).send({ status: false, message: "Something went wrong! Please try again" });
            }
        } else {
            return res.status(404).send({ status: false, message: "Activity not found! Please check and try again" });
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: "Something went wrong! Please try again" });
    }
};

export async function myActivity(req, res) {
    const { user_id, username, overall_points } = req.data;
    const { date } = req.body;
    try {
        let skip = req.body.skip ? parseInt(req.body.skip) : 0;
        let limit = req.body.limit ? parseInt(req.body.limit) : 50;
        let condition = { user_id: user_id, status: 1 };
        let month_cond = { ...condition };
        if (date && !isNaN(new Date(date))) {
            condition.createdAt = {
                $gte: new Date(moment(date).startOf("M")),
                $lte: new Date(moment(date).endOf("M"))
            };
            month_cond.createdAt = {
                $gte: new Date(moment(date).startOf("M")),
                $lte: new Date(moment(date).endOf("M"))
            };
        } else {
            month_cond.createdAt = {
                $gte: new Date(moment().startOf("M")),
                $lte: new Date(moment().endOf("M"))
            };
        };
        let monthCount = UserActivity.aggregate([
            {
                $match: month_cond
            }, {
                $group: {
                    _id: null,
                    points: { $sum: "$points" }
                }
            }
        ]);
        let myActivityList = UserActivity.find(condition).sort({ createdAt: -1 }).skip(skip).limit(limit);
        let userDetails = {
            user_id: user_id,
            username: username,
            overall_points: overall_points
        }
        let activityCount = UserActivity.countDocuments(condition);
        Promise.all([myActivityList, activityCount, monthCount]).then(([list, counts, month_count]) => {
            return res.status(200).send({ status: true, message: "My activity list found", response: { list: list, totalCounts: counts, monthCount: month_count.length > 0 ? month_count[0].points : 0, userDetails: userDetails } });
        })
    } catch (error) {
        return res.status(500).send({ status: false, message: "Something went wrong! Please try again" });
    }
};

export async function userActivity(req, res) {
    const { userId, date } = req.body;
    try {
        let skip = req.body.skip ? parseInt(req.body.skip) : 0;
        let limit = req.body.limit ? parseInt(req.body.limit) : 50;
        let condition = { status: 1 };
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Invalid User" });
        }
        condition.user_id = new mongoose.Types.ObjectId(userId);
        let userDetails = await Users.findOne({ _id: new mongoose.Types.ObjectId(userId) });
        if (userDetails) {
            let month_cond = { ...condition };
            if (date && !isNaN(new Date(date))) {
                condition.createdAt = {
                    $gte: new Date(moment(date).startOf("M")),
                    $lte: new Date(moment(date).endOf("M"))
                };
                month_cond.createdAt = {
                    $gte: new Date(moment(date).startOf("M")),
                    $lte: new Date(moment(date).endOf("M"))
                };
            } else {
                month_cond.createdAt = {
                    $gte: new Date(moment().startOf("M")),
                    $lte: new Date(moment().endOf("M"))
                };
            }
            let myActivityList = UserActivity.find(condition).sort({ createdAt: -1 }).skip(skip).limit(limit);
            let activityCount = UserActivity.countDocuments(condition);
            let monthCount = UserActivity.aggregate([
                {
                    $match: month_cond
                }, {
                    $group: {
                        _id: null,
                        points: { $sum: "$points" }
                    }
                }
            ]);
            Promise.all([myActivityList, activityCount, monthCount]).then(([list, counts, month_count]) => {
                return res.status(200).send({ status: true, message: "My activity list found", response: { list: list, totalCounts: counts, userDetails: userDetails, monthCount: month_count.length > 0 ? month_count[0].points : 0 } });
            });
        } else {
            return res.status(404).send({ status: false, message: "User not found" })
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: "Something went wrong! Please try again" });
    }
};

export async function userDetailsGet(req, res) {
    const { user_id, username, overall_points, email } = req.data;
    try {
        let findUser = {
            user_id: user_id,
            username: username,
            overall_points: overall_points,
            email: email
        };
        return res.status(200).send({ status: true, message: "User Details found", response: findUser });
    } catch (error) {
        return res.status(500).send({ status: false, message: "Something went wrong! Please try again" });

    }
}
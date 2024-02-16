import bcrypt from "bcrypt";
import Admin from "../schema/admin-schema.js";
import { CONFIG } from "../config.js";
import jwt from "jsonwebtoken";
import Activity from "../schema/activity-schema.js";
import moment from "moment";

export async function admin_register(req, res) {
    try {
        let insert_obj = {
            username: CONFIG.ADMIN.USERNAME,
            password: CONFIG.ADMIN.PASSWORD
        };
        let getSalt = await bcrypt.genSaltSync(10);
        insert_obj.password = await bcrypt.hash(insert_obj.password, getSalt);
        let adminCheck = await Admin.findOne({ username: insert_obj.username })
        if (!adminCheck) {
            await Admin.insertMany(insert_obj).then(result => {
                if (result && result.length > 0) {
                    return res.status(200).send({ status: true, message: "Admin Register Successfully" });
                } else {
                    return res.status(500).send({ status: false, message: "Something went wrong! Please try again" });
                }
            }).catch((error) => {
                return res.status(500).send({ status: false, message: "Something went wrong! Please try again " });
            });
        } else {
            return res.status(404).send({ status: false, message: "Admin Already registered! Please try again." });
        };
    } catch (error) {
        return res.status(500).send({ status: false, message: "Something went wrong! Please try again" });
    }
};

export async function admin_login(req, res) {
    const { username, password } = req.body;
    try {
        let findAdmin = await Admin.findOne({ username: username, status: 1 });
        if (findAdmin) {
            let pass_match = await bcrypt.compare(password, findAdmin.password);
            if (pass_match) {
                let jwt_obj = {
                    username: findAdmin.username,
                    user_id: findAdmin._id
                };
                jwt_obj.token = jwt.sign({ data: jwt_obj }, CONFIG.JWT_SECRET, { expiresIn: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 360) });
                return res.status(200).send({ status: true, message: "Login successfully", response: jwt_obj });
            } else {
                return res.status(404).send({ status: false, message: "Incorrect Password! Please check and try again" });
            };
        } else {
            return res.status(404).send({ status: false, message: "Invalid credentials! Please try again." })
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: "Something went wrong! Please try again" });
    }
};

export async function activityAdd(req, res) {
    const { name, points } = req.body;
    try {
        let insert_obj = {
            name: name,
            points: Number(points)
        };
        let insertActivity = await Activity.insertMany(insert_obj);
        if (insertActivity && Array.isArray(insertActivity) && insertActivity.length > 0) {
            return res.status(200).send({ status: true, message: "Activity Created" });
        } else {
            return res.status(500).send({ status: false, message: "Something went wrong! Please try again" });
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: "Something went wrong! Please try again" });
    }
}

export async function activityList(req, res) {
    const { date, search } = req.body;
    try {
        let condition = {};
        let skip = req.body.skip ? parseInt(req.body.skip) : 0;
        let limit = req.body.limit ? parseInt(req.body.limit) : 10;
        if (search) {
            condition.name = { $regex: search + ".*", $options: "si" };
        };
        if (date && !isNaN(new Date(date))) {
            condition.createdAt = {
                $gte: new Date(moment(date).startOf("M")),
                $lte: new Date(moment(date).endOf("M"))
            }
        }
        let activityList = Activity.find(condition).sort({ createdAt: -1 }).skip(skip).limit(limit);
        let activityCount = Activity.countDocuments(condition);
        Promise.all([activityList, activityCount]).then(([list, count]) => {
            return res.status(200).send({ status: true, message: "Activity list found", response: { list: list, count: count } });
        })
    } catch (error) {
        return res.status(500).send({ status: false, message: "Something went wrong! Please try again" });
    }
}
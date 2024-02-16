import jwt from "jsonwebtoken";
import { CONFIG } from "../config.js";
import User from "../schema/user-schema.js";
import mongoose from "mongoose";

export async function adminAuthorization(req, res, next) {
    try {
        let token = req.headers.authorization;
        if (token) {
            let tokenEncode = jwt.verify(token, CONFIG.JWT_SECRET);
            if (tokenEncode && tokenEncode.data) {
                next();
            } else {
                return res.status(404).send({ status: false, message: "Unauthorized User", logout: true });
            }
        } else {
            return res.status(404).send({ status: false, message: "Unauthorized User", logout: true });
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: "Something went wrong! Please try again" });
    }
};

export async function userAuthorization(req, res, next) {
    try {
        let token = req.headers.authorization;
        req.data = {};
        if (token) {
            let tokenEncode = jwt.verify(token, CONFIG.JWT_SECRET);
            if (tokenEncode && tokenEncode.data) {
                let checkUser = await User.findOne({_id:new mongoose.Types.ObjectId(tokenEncode.data.user_id)});
                if(checkUser){
                    req.data ={
                        user_id:checkUser._id,
                        username:checkUser.name,
                        overall_points:checkUser.overall_points,
                        email:checkUser.email,
                    };
                    next();
                }else {
                    return res.status(404).send({ status: false, message: "Unauthorized User", logout: true });
                }
            } else {
                return res.status(404).send({ status: false, message: "Unauthorized User", logout: true });
            }
        } else {
            return res.status(404).send({ status: false, message: "Unauthorized User", logout: true });
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: "Something went wrong! Please try again" });
    }
};
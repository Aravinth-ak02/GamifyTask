import express from "express";
import { validator } from "../middlewares/validator.js";
import * as commonFunction from "../middlewares/common.js";
import * as userController from "../controller/user.js";
import { userAuthorization } from "../middlewares/authorization.js"
const user = express.Router();

user.post("/register", validator.user_register, commonFunction.checkUserDuplicateMail, userController.userRegister)
user.post("/login", validator.user_login, userController.userLogin);
user.post("/leaderboard", userController.leaderboardList);
user.post("/new-activities", userAuthorization, userController.newActivities);
user.post("/activity/complete", userAuthorization, validator.complete_activity, commonFunction.checkActivityComplete, userController.activityComplete);
user.post("/my-activity/list", userAuthorization, userController.myActivity);
user.post("/activity/list", validator.user_activity_list, userController.userActivity);
user.get("/details/get", userAuthorization, userController.userDetailsGet);

export { user }
import express from "express";
import * as controller from '../controller/admin.js';
import { validator } from "../middlewares/validator.js";
import * as common from "../middlewares/common.js";
import { adminAuthorization } from "../middlewares/authorization.js";
const admin = express.Router();

admin.get("/register", controller.admin_register);
admin.post("/login", validator.admin_login, controller.admin_login);
admin.post("/activity/add", adminAuthorization, validator.add_activity, common.checkDuplicateActivity, controller.activityAdd);
admin.post("/activity/list",adminAuthorization,controller.activityList);

export { admin }
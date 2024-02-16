import { check, validationResult } from "express-validator"
let validator = {};


validator.user_register = [
    check('name','Name is required').notEmpty(),
    check('email','Email is required').notEmpty(),
    check('password','Password is required').notEmpty(),
    check('confirm_password','Confirm Password is required').notEmpty(),
    (req,res,next)=>{
        let errors = validationResult(req).errors;
        if(errors && Array.isArray(errors) && errors.length > 0){
            return res.status(400).send({status:false,message:errors[0].msg})
        };
        next();
    }
];

validator.user_login = [
    check('email','Email is required').notEmpty(),
    check('password','Password is required').notEmpty(),
    (req,res,next)=>{
        let errors = validationResult(req).errors;
        if(errors && Array.isArray(errors) && errors.length > 0){
            return res.status(400).send({status:false,message:errors[0].msg})
        };
        next();
    }
];

validator.admin_login = [
    check('username','Username is required').notEmpty(),
    check('password','Password is required').notEmpty(),
    (req,res,next)=>{
        let errors = validationResult(req).errors;
        if(errors && Array.isArray(errors) && errors.length > 0){
            return res.status(400).send({status:false,message:errors[0].msg})
        };
        next();
    }
];

validator.add_activity = [
    check('name','Name is required').notEmpty(),
    check('points','Points is required').notEmpty(),
    (req,res,next)=>{
        let errors = validationResult(req).errors;
        if(errors && Array.isArray(errors) && errors.length > 0){
            return res.status(400).send({status:false,message:errors[0].msg})
        };
        next();
    }
];

validator.activity_complete = [
    check('activity_id','Activity id is required').notEmpty(),
    (req,res,next)=>{
        let errors = validationResult(req).errors;
        if(errors && Array.isArray(errors) && errors.length > 0){
            return res.status(400).send({status:false,message:errors[0].msg})
        };
        next();
    }
];

validator.user_activity_list = [
    check('userId','User id is required').notEmpty(),
    (req,res,next)=>{
        let errors = validationResult(req).errors;
        if(errors && Array.isArray(errors) && errors.length > 0){
            return res.status(400).send({status:false,message:errors[0].msg})
        };
        next();
    }
];

validator.complete_activity = [
    check('activity_id','Activity id is required').notEmpty(),
    (req,res,next)=>{
        let errors = validationResult(req).errors;
        if(errors && Array.isArray(errors) && errors.length > 0){
            return res.status(400).send({status:false,message:errors[0].msg})
        };
        next();
    }
];


export { validator };
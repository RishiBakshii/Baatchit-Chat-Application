import { NextFunction, Request, Response } from "express";
import { type signupSchemaType } from "../schemas/auth.schema.js";
import { User } from "../models/user.model.js";
import { CustomError, asyncErrorHandler } from "../utils/error.utils.js";
import { sendToken } from "../utils/auth.util.js";
import type { loginSchemaType } from "../schemas/auth.schema.js";
import bcrypt from 'bcryptjs'


const signup = asyncErrorHandler(async(req:Request,res:Response,next:NextFunction)=>{

    const {username,password,avatar,email,name}:signupSchemaType=req.body

    const isExistingUser = await User.findOne({email})

    if(isExistingUser){
        return next(new CustomError("User already exists",400))
    }

    const existingUsername = await User.findOne({username})

    if(existingUsername){
        return next(new CustomError("Username is already taken",400))
    }

    const hashedPassword = bcrypt.hash(password,10)

    const newUser = await User.create({avatar,email,name,password:hashedPassword,username})
    
    sendToken(res,newUser._id,201,newUser)
}) 

const login = asyncErrorHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const {email,password}:loginSchemaType=req.body

    const isExistingUser = await User.findOne({email}).select("+password")

    if(isExistingUser && await bcrypt.compare(password,isExistingUser.password)){
        sendToken(res,isExistingUser._id,200,isExistingUser)
    }

    return next(new CustomError("Invalid Credentials",404))
    
})


export {signup,login}
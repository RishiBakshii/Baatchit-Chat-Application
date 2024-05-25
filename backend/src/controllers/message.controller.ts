import { NextFunction, Request, Response } from "express";
import { Message } from "../models/message.model.js";
import { asyncErrorHandler } from "../utils/error.utils.js";
import { Types } from "mongoose";

const getMessages = asyncErrorHandler(async(req:Request,res:Response,next:NextFunction)=>{

    const {id} = req.params
    const {page = 1, limit = 12} = req.query

    const pageNumber = Number(page)
    const limitNumber = Number(limit)

    const messages = await Message.aggregate([

        {
            $match: {
                chat: new Types.ObjectId(id),
            },
        },
        {
            $sort:{
                'createdAt':-1
            }
        },
        {
            $lookup: {
            from: "users",
            localField: "sender",
            foreignField: "_id",
            as: "sender",
            pipeline: [
                {
                $addFields: {
                    avatar: "$avatar.secureUrl",
                },
                },
                {
                $project: {
                    username: 1,
                    avatar: 1,
                },
                },
            ],
            },
        },
        {
            $addFields: {
                sender: {
                    $arrayElemAt: ["$sender", 0],
                },
            },
        },
        {
            $addFields: {
                "attachments":"$attachments.secureUrl"
            },
        },
        // {
        //     $unwind:{
        //         path:"$pollOptions",
        //         preserveNullAndEmptyArrays:true,
        //     }
        // },
        // {
        //     $lookup:{
        //         from:"users",
        //         localField:"pollOptions.votes",
        //         foreignField:"_id",
        //         as:"pollOptions.votes",
        //         pipeline:[
        //             {
        //                 $project:{
        //                     username:1,
        //                     avatar:"$avatar.secureUrl"
        //                 }
        //             }
        //         ]
        //     }
        // },
        // {
        //     $group: {
        //       _id: "$_id",  // Group by the original message _id
        //       sender: { $first: "$sender" },  // Keep the first sender object
        //       chat: { $first: "$chat" },  // Keep the first chat ID
        //       isPoll: { $first: "$isPoll" },  // Keep the first isPoll flag
        //       content:{$first:'$content'},
        //       url:{$first:'$url'},
        //       pollQuestion: { $first: "$pollQuestion" }, // Keep the first pollQuestion
        //       pollOptions: {
        //         $push: "$pollOptions"  // Push each unwound pollOption into the array
        //       },

        //       attachments: { $first: "$attachments" },  // Keep the first attachments array (optional)
        //     //   createdAt: { $first: "$createdAt" },  // Keep the first createdAt timestamp
        //       updatedAt: { $first: "$updatedAt" },  // Keep the first updatedAt timestamp
        //     }
        // },
        {
            $skip: Math.ceil((pageNumber - 1) * limitNumber)
        },
        {
            $limit: limitNumber,
        },
    ])

    const totalMessagesCount = await Message.countDocuments({ chat: new Types.ObjectId(id) });
    const totalPages = Math.ceil(totalMessagesCount / limitNumber);

    const messagesWithTotalPage = {
        messages:messages.reverse(),
        totalPages,
    }
    return res.status(200).json(messagesWithTotalPage)

})

export {getMessages}
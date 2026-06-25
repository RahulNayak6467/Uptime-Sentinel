import { NextFunction, Request, Response } from "express";
import {uuidSchema} from "../validators/uuidValidation";
import {ZodError} from "zod";
import {AppError} from "../errors/AppError";
import {sendResponseTimeData} from "../services/responseTime.services";

export const getResponseTime = async(req:Request,res:Response,next:NextFunction) => {
    const monitor_id = req.params.id as string
    const user_id = req.user?.user_id;
    const timeRange = req.query.range as string | undefined

    if(!timeRange) return res.status(400).json({message: "Not a valid time range"});


    if(!user_id){
        return res.status(401)
    }

    try {

        uuidSchema.parse(monitor_id);
        const timeRangeData = await sendResponseTimeData(monitor_id,user_id,timeRange)
        return res.status(200).json(timeRangeData)
    }
    catch (err){
        if(err instanceof ZodError){
            return next(new AppError(
                400,
                "Monitor ID must be a valid UUID",
                "INVALID_MONITOR_ID",
            ))
        }

        return next(err)
    }

}
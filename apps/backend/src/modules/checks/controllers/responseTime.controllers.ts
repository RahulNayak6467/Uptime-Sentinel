import { NextFunction, Request, Response } from "express";
import {uuidSchema} from "../../../shared/validators/uuidValidation";
import {AppError} from "../../../shared/errors/AppError";
import {sendResponseTimeData} from "../services/responseTime.services";

export const getResponseTime = async(req:Request,res:Response,next:NextFunction) => {
    const monitorId = req.params.monitorId as string
    const userId = req.user?.user_id;
    const timeRange = req.query.range as string | undefined

    if(!timeRange) {
        throw new AppError(400, "Not a valid time range", "INVALID_TIME_RANGE");
    }


    if(!userId){
        throw new AppError(401, "Unauthenticated", "UNAUTHENTICATED");
    }

    try {

        uuidSchema.parse(monitorId);
        const timeRangeData = await sendResponseTimeData(monitorId,userId,timeRange)
        return res.status(200).json({ data: timeRangeData })
    }
    catch (err){
        return next(err)
    }

}

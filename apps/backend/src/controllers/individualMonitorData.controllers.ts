import { NextFunction, Request, Response } from "express";
import {uuidSchema} from "../validators/uuidValidation";
import {ZodError} from "zod";
import {AppError} from "../errors/AppError";
import {individualMonitorInfo} from "../services/individualMonitorData.services";

export const IndividualMonitorStatsData = async(req: Request, res: Response,next:NextFunction) => {
    const user_id = req.user?.user_id
    const monitor_id = req.params.id as string

    try {
        if(!user_id){
            throw new AppError(401,"Unauthenticated","UNAUTHORIZED")
        }
        uuidSchema.parse(monitor_id);
        const getIndividualMonitorData = await individualMonitorInfo(user_id,monitor_id)
        return res.status(200).json(getIndividualMonitorData);
    }
    catch (error) {
        if(error instanceof ZodError){
            return next(new AppError(
                400,
                "Monitor ID must be a valid UUID",
                "INVALID_MONITOR_ID"))
        }
        return next(error)
    }
}
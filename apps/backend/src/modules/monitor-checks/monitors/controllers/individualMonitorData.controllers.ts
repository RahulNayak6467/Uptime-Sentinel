import { NextFunction, Request, Response } from "express";
import {uuidSchema} from "../../../../shared/validators/uuidValidation";
import {AppError} from "../../../../shared/errors/AppError";
import {individualMonitorInfo} from "../services/individualMonitorData.services";

export const IndividualMonitorStatsData = async(req: Request, res: Response,next:NextFunction) => {
    const userId = req.user?.user_id
    const monitorId = req.params.monitorId as string

    try {
        if(!userId){
            throw new AppError(401,"Unauthenticated","UNAUTHENTICATED")
        }
        uuidSchema.parse(monitorId);
        const getIndividualMonitorData = await individualMonitorInfo(userId,monitorId)
        return res.status(200).json({ data: getIndividualMonitorData });
    }
    catch (error) {
        return next(error)
    }
}

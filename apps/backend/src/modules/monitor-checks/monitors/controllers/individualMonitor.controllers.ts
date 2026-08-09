import {Request,Response,NextFunction} from "express";
import {individualMonitorServices} from "../services/individualMonitor.services";
import {uuidSchema} from "../../../../shared/validators/uuidValidation";
import {AppError} from "../../../../shared/errors/AppError";

export const getIndividualMonitorStats = async(req: Request, res: Response,next:NextFunction) => {
    const monitorId = req.params.monitorId as string;

    const userId = req.user?.user_id;
    if(!userId) {
        throw new AppError(401, "Unauthenticated", "UNAUTHENTICATED");
    }

    try {
        uuidSchema.parse(monitorId);
        const getStats = await individualMonitorServices(userId,monitorId)
        return res.status(200).json({ data: getStats })
    }
    catch(err){
        return next(err);
    }
}

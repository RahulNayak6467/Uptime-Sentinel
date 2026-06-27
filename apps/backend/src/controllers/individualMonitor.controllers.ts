import {Request,Response,NextFunction} from "express";
import {individualMonitorServices} from "../services/individualMonitor.services";
import {uuidSchema} from "../validators/uuidValidation";
import {AppError} from "../errors/AppError";
import {ZodError} from "zod";

export const getIndividualMonitorStats = async(req: Request, res: Response,next:NextFunction) => {
    const monitor_id = req.params.id as string;

    const user_id = req.user?.user_id;
    if(!user_id) return res.status(401).json({message: "Unauthenticated"});

    try {
        uuidSchema.parse(monitor_id);
        const getStats = await individualMonitorServices(user_id,monitor_id)
        return res.status(200).json(getStats)
    }
    catch(err){
        if (err instanceof ZodError) {
            return next(
                new AppError(
                    400,
                    "Monitor ID must be a valid UUID",
                    "INVALID_MONITOR_ID",
                ),
            );
        }
        return next(err);
    }
}
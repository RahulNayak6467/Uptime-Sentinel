import {Request,Response,NextFunction} from "express";
import {fetchDashboardOverviewData} from "../services/dahsboardoverview.services";
import { AppError } from "../../../../shared/errors/AppError";

export const getDashboardOverview = async(req: Request, res: Response,next:NextFunction) => {
    const userId = req.user?.user_id
    if(!userId){
        throw new AppError(401, "Unauthenticated", "UNAUTHENTICATED");
    }
    try {
        const dashboardOverviewData  = await fetchDashboardOverviewData(userId)
        return res.status(200).json({ data: dashboardOverviewData });
    }
    catch (err){
        return next(err)
    }
}

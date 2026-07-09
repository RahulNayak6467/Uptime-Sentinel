import {Request,Response,NextFunction} from "express";
import {fetchDashboardOverviewData} from "../services/dahsboardoverview.services";

export const getDashboardOverview = async(req: Request, res: Response,next:NextFunction) => {
    const user_id = req.user?.user_id
    if(!user_id){
        return res.status(401).json({message:"Unauthenticated"})
    }
    try {
        const dashboardOverviewData  = await fetchDashboardOverviewData(user_id)
        return res.status(200).json(dashboardOverviewData);
    }
    catch (err){
        return next(err)
    }
}
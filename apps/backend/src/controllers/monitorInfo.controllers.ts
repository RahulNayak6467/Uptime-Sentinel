import {NextFunction, Request, Response} from "express";
import {getMonitorsDetails} from "../services/monitorInfo.services";

export const getMonitorsData = async (req:Request,res:Response,next:NextFunction) => {
    const user_id = req.user?.user_id;
    if(!user_id){
        return res.status(401).json({message:"Unauthenticated"});
    }

    try{
       const getMonitorsInfo = await getMonitorsDetails(user_id);
       return res.status(200).json(getMonitorsInfo);
    }
    catch(err){
        return next(err);
    }
}
import {Request, Response, NextFunction, RequestHandler} from "express";
import {getAllMonitorInfo} from "../services/allMonitorData.services";

export const getAllMonitorData: RequestHandler = async (req:Request, res:Response,next:NextFunction) => {
    const user_id = req.user?.user_id

    try {
        if(!user_id){
            return res.status(401).json({message: "Unauthenticated"})
        }
        const getMonitorData = await getAllMonitorInfo(user_id);
        return res.status(200).json(getMonitorData);
    }
    catch(err){
        return next(err)
    }
}
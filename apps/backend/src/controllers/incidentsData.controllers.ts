import {Request, Response, NextFunction} from "express";

export const getAllIncidentsData = async (req: Request, res: Response, next:NextFunction) => {
    const user_id = req.user?.user_id

    try {
        if(!user_id){
            return res.status(401).json({message:"Unauthenticated"})
        }

        const getAllIncidents = await
    }


}
import { NextFunction, Request, Response } from "express";

export default function checkRole(roles:string[]){
    return (req:Request, res:Response, next:NextFunction) => {
        if(!roles.includes(req.user.role)){
            res.status(500).json({
                success: false,
                message: 'Access denied',
            })
        }else{
            next()
        }
    }
}
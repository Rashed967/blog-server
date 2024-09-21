import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import config from '../config'

export default function verifyUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const headers = req.headers['authorization']
    const token = headers && headers.split(' ')[1]
    if (!token) {
        res.status(401).json({
            success: false,
            message: 'You have no permission to enter here',
        })
    } else {
        // verify user token
        jwt.verify(token, config.secret_key, (error, user) => {
            if (error) {
                res.status(403).json({
                    success: false,
                    message: 'Your time is expired, Login again',
                })
            } else {
                req.user = user;
                next()
            }
        })
    }
}

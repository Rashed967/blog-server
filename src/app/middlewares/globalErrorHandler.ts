import { NextFunction, Request, Response } from 'express'

const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    next(
        res.status(404).json({
            success: false,
            message: err.message || 'something went wrong',
            error: err || '',
        })
    )
}

export default globalErrorHandler

import { Request, Response } from 'express'
import { userJoiValidationSchema } from './user.joy.schema'
import { userServices } from './user.service'
import hashingPassword, { verifyPassword } from '../../utils/hassingPassword'
import { jwtToken } from '../../utils/jwtTokenGenerate&Verify'
import { User } from './user.model'


// create user
const createUser = async (req: Request, res: Response) => {
    try {
        const user = req.body.user
        const { error, value } = userJoiValidationSchema.validate(user)
        if (error) {
            res.status(400).json({
                success: false,
                message: 'User validation field',
                error: error,
            })
        } else {
            const password = await hashingPassword(user.password)
            const userWithHashedPassword = { ...user, password }
            const result = await userServices.createUserInDB(
                userWithHashedPassword
            )
            res.status(200).json({
                success: true,
                message: 'User registered successfully.',
                data: result,
            })
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'All field must validate',
            error: error,
        })
    }
}

// login user
const loginUser = async (req: Request, res: Response) => {
    const user = req.body.user

    const existingUser = await User.findOne({
        email: user.email,
    })

    if (existingUser) {
        const isPasswordMatched = await verifyPassword(
            user.password,
            existingUser?.password
        )
        if (isPasswordMatched) {
            const token = jwtToken.generateToken(existingUser)
            res.send({
                success: true,
                message: 'user loged in successfully',
                data: token,
            })
        } else {
            res.send('Wrong password')
        }
    } else {
        res.send('no such a email found!')
    }
}

// get user profile data by id
const getUserProfileById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const user = await userServices.getUserProfileByIdFromDb(id)
        if (user) {
            res.send({
                success: true,
                message: 'found a user profile data',
                data: user,
            })
        } else {
            res.send({
                success: false,
                message: 'cannot found any user with this id',
                data: user,
            })
        }
    } catch (error) {
        res.send({
            success: false,
            message: 'cannot found any user',
            data: error,
        })
    }
}

// update profile bio by id
const updateProfileById = async (req: Request, res: Response) => {
    try {
        const user = req.user
        const id = req.params.id
        const dataToBeUpdated = req.body.data
        if (
            (user.role === 'author' && user.id === id) ||
            (user.role === 'editor' && user.id === id)
        ) {
            if ('role' in dataToBeUpdated) {
                res.send({
                    success: false,
                    message: 'You do not have permission to change your role',
                })
            } else {
                const newProfileData = await userServices.updateProfileByIdInDb(
                    id,
                    dataToBeUpdated
                )
                res.send({
                    success: true,
                    message: 'user profile data updated',
                    data: newProfileData,
                })
            }
        } else if (user.role === 'admin') {
            const newProfileData = await userServices.updateProfileByIdInDb(
                id,
                dataToBeUpdated
            )
            res.send({
                success: true,
                message: 'user profile data updated',
                data: newProfileData,
            })
        } else {
            res.send({
                success: true,
                message: 'You do not have permission to change other profile',
            })
        }
    } catch (error) {
        res.send({
            success: false,
            message: 'cannot Updadate user, Something went wrong',
            data: error,
        })
    }
}

// get All user from db (only admin)
const getAllUser = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getAllUserFromDb()
        res.status(200).json({
            success: true,
            message: 'Users data found successfully',
            data: result,
        })
    } catch (error: any) {
        res.status(404).json({
            success: false,
            message: 'user find Error',
            error: error.message || 'someting went wrong',
        })
    }
}




export const userController = {
    createUser,
    loginUser,
    getUserProfileById,
    updateProfileById,
    getAllUser,
}
